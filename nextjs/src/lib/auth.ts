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

// Alternative method using /.auth/me endpoint
async function getAuthFromEndpoint(request: NextRequest): Promise<AuthResult> {
  try {
    // Get the base URL from the request
    const protocol = request.headers.get('x-forwarded-proto') || 'https';
    const host = request.headers.get('host');
    const baseUrl = `${protocol}://${host}`;
    
    // Make internal call to /.auth/me
    const authResponse = await fetch(`${baseUrl}/.auth/me`, {
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
        'User-Agent': request.headers.get('User-Agent') || 'NextJS-Internal'
      }
    });

    if (!authResponse.ok) {
      return { isAuthenticated: false, isAuthorized: false };
    }

    const responseText = await authResponse.text();
    if (!responseText.trim()) {
      return { isAuthenticated: false, isAuthorized: false };
    }

    let authData;
    try {
      authData = JSON.parse(responseText);
    } catch (parseError) {
      return { isAuthenticated: false, isAuthorized: false };
    }

    // Handle Azure App Service v2 format (array with user data)
    if (Array.isArray(authData) && authData.length > 0 && authData[0].user_id) {
      const userInfo = authData[0];
      
      // Find GitHub username from claims
      let username = 'Unknown User';
      if (userInfo.user_claims && Array.isArray(userInfo.user_claims)) {
        const loginClaim = userInfo.user_claims.find((claim: any) => claim.typ === 'urn:github:login');
        username = loginClaim?.val || userInfo.user_id;
      }

      // Check database for admin user
      const adminUser = await getAdminUserFromDatabase(username, userInfo.user_id);
      
      if (adminUser) {
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

      // Fallback to legacy whitelist
      if (LEGACY_ALLOWED_ADMIN_USERS.includes(username)) {
        return {
          isAuthenticated: true,
          isAuthorized: true,
          user: {
            githubUsername: username,
            githubUserId: userInfo.user_id,
            displayName: username,
            role: 'super_admin'
          }
        };
      }
    }

    return { isAuthenticated: false, isAuthorized: false };
  } catch (error) {
    console.error('Error in getAuthFromEndpoint:', error);
    return { isAuthenticated: false, isAuthorized: false };
  }
}

export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    const authHeader = request.headers.get('x-ms-client-principal');
    
    if (authHeader) {
      try {
        // Decode the base64 encoded auth data
        const authData = JSON.parse(Buffer.from(authHeader, 'base64').toString());
        
        if (authData && Array.isArray(authData) && authData.length > 0) {
          const userInfo: AzureAuthUser = authData[0];
          
          if (userInfo.user_id) {
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

            if (isLegacyAuthorized) {
              return {
                isAuthenticated: true,
                isAuthorized: true,
                user: {
                  githubUsername: username,
                  githubUserId: userInfo.user_id,
                  displayName: username,
                  role: 'super_admin'
                }
              };
            }
          }
        }
      } catch (headerError) {
        console.error('Error parsing x-ms-client-principal header:', headerError);
      }
    }

    // Method 2: Try alternative headers
    const principalName = request.headers.get('x-ms-client-principal-name');
    const principalId = request.headers.get('x-ms-client-principal-id');
    
    if (principalName && principalId) {
      
      const adminUser = await getAdminUserFromDatabase(principalName, principalId);
      if (adminUser) {
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

      if (LEGACY_ALLOWED_ADMIN_USERS.includes(principalName)) {
        return {
          isAuthenticated: true,
          isAuthorized: true,
          user: {
            githubUsername: principalName,
            githubUserId: principalId,
            displayName: principalName,
            role: 'super_admin'
          }
        };
      }
    }

    // Method 3: Try /.auth/me endpoint as fallback
    const endpointResult = await getAuthFromEndpoint(request);
    if (endpointResult.isAuthenticated) {
      return endpointResult;
    }

    return { isAuthenticated: false, isAuthorized: false };
    
  } catch (error) {
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