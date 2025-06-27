import { NextRequest } from 'next/server';
import { getCosmosContainer } from './cosmos';
import { AdminUser } from './database-schema';

// Legacy whitelist for backward compatibility during migration
const LEGACY_ALLOWED_ADMIN_USERS = [
  'mozdowski',
  // Add other GitHub usernames here
  // 'teammate1',
  // 'teammate2',
];

interface AzureAuthUser {
  access_token: string;
  provider_name: string;
  user_claims: Array<{
    typ: string;
    val: string;
  }>;
  user_id: string;
}

interface AuthResult {
  isAuthenticated: boolean;
  isAuthorized: boolean;
  user?: {
    githubUsername: string;
    githubUserId: string;
    displayName: string;
    role: 'super_admin' | 'admin' | 'editor';
    permissions?: AdminUser['permissions'];
  };
}

async function getAdminUserFromDatabase(githubUsername: string, githubUserId: string): Promise<AdminUser | null> {
  try {
    const container = getCosmosContainer();
    const { resources: users } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'admin_user' AND (c.githubUsername = @username OR c.githubUserId = @userId) AND c.isActive = true",
        parameters: [
          { name: '@username', value: githubUsername },
          { name: '@userId', value: githubUserId }
        ]
      })
      .fetchAll();

    return users.length > 0 ? users[0] : null;
  } catch (error) {
    console.error('Error fetching admin user from database:', error);
    return null;
  }
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Get authentication data from Azure App Service headers
    const authHeader = request.headers.get('x-ms-client-principal');
    
    if (!authHeader) {
      return { isAuthenticated: false, isAuthorized: false };
    }

    // Decode the base64 encoded auth data
    const authData = JSON.parse(Buffer.from(authHeader, 'base64').toString());
    
    if (!authData || !Array.isArray(authData) || authData.length === 0) {
      return { isAuthenticated: false, isAuthorized: false };
    }

    const userInfo: AzureAuthUser = authData[0];
    
    if (!userInfo.user_id) {
      return { isAuthenticated: false, isAuthorized: false };
    }

    // Extract GitHub username
    const loginClaim = userInfo.user_claims?.find(
      claim => claim.typ === 'urn:github:login'
    );
    const username = loginClaim?.val || userInfo.user_id;

    // First check database for admin user
    const adminUser = await getAdminUserFromDatabase(username, userInfo.user_id);
    
    if (adminUser) {
      // Update last login time
      try {
        const container = getCosmosContainer();
        const updatedUser = {
          ...adminUser,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await container.item(adminUser.id, adminUser.id).replace(updatedUser);
      } catch (error) {
        console.error('Error updating last login time:', error);
      }

      return {
        isAuthenticated: true,
        isAuthorized: true,
        user: {
          githubUsername: adminUser.githubUsername,
          githubUserId: adminUser.githubUserId,
          displayName: adminUser.displayName,
          role: adminUser.role,
          permissions: adminUser.permissions
        }
      };
    }

    // Fallback to legacy whitelist for backward compatibility
    const isLegacyAuthorized = LEGACY_ALLOWED_ADMIN_USERS.includes(username);

    return {
      isAuthenticated: true,
      isAuthorized: isLegacyAuthorized,
      user: isLegacyAuthorized ? {
        githubUsername: username,
        githubUserId: userInfo.user_id,
        displayName: username,
        role: 'super_admin' // Legacy users get super_admin role
      } : undefined
    };
  } catch (error) {
    console.error('Auth verification error:', error);
    return { isAuthenticated: false, isAuthorized: false };
  }
}

// Legacy function for backward compatibility
export async function checkAdminAuth(request: NextRequest): Promise<{
  isAuthenticated: boolean;
  isAuthorized: boolean;
  username?: string;
  userId?: string;
}> {
  const result = await verifyAuth(request);
  return {
    isAuthenticated: result.isAuthenticated,
    isAuthorized: result.isAuthorized,
    username: result.user?.githubUsername,
    userId: result.user?.githubUserId
  };
}

export function createAuthResponse(message: string, status: number = 401) {
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { 'Content-Type': 'application/json' }
    }
  );
} 