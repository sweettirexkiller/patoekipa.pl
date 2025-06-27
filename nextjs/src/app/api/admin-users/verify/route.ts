import { NextRequest, NextResponse } from 'next/server';
import { getCosmosContainer } from '@/lib/cosmos';
import { AdminUser } from '@/lib/database-schema';

// Legacy whitelist for backward compatibility during migration
const LEGACY_ALLOWED_ADMIN_USERS = [
  'mozdowski',
  // Add other GitHub usernames here as needed
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { githubUsername, githubUserId } = body;

    if (!githubUsername || !githubUserId) {
      return NextResponse.json({ error: 'Missing githubUsername or githubUserId' }, { status: 400 });
    }

    const container = getCosmosContainer();
    
    // First check database for admin user
    const { resources: users } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'admin_user' AND (c.githubUsername = @username OR c.githubUserId = @userId) AND c.isActive = true",
        parameters: [
          { name: '@username', value: githubUsername },
          { name: '@userId', value: githubUserId }
        ]
      })
      .fetchAll();

    if (users.length > 0) {
      const adminUser: AdminUser = users[0];
      
      // Update last login time
      try {
        const updatedUser = {
          ...adminUser,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await container.item(adminUser.id, adminUser.id).replace(updatedUser);
      } catch (error) {
        console.error('Error updating last login time:', error);
      }

      return NextResponse.json({
        githubUsername: adminUser.githubUsername,
        githubUserId: adminUser.githubUserId,
        displayName: adminUser.displayName,
        role: adminUser.role,
        permissions: adminUser.permissions
      });
    }

    // Fallback to legacy whitelist for backward compatibility
    if (LEGACY_ALLOWED_ADMIN_USERS.includes(githubUsername)) {
      return NextResponse.json({
        githubUsername,
        githubUserId,
        displayName: githubUsername,
        role: 'super_admin', // Legacy users get super_admin role
        permissions: {
          canManageUsers: true,
          canManageProjects: true,
          canManageTeam: true,
          canManageTestimonials: true,
          canManageContacts: true,
        }
      });
    }

    // User not found in database or legacy list
    return NextResponse.json({ error: 'Not authorized for admin access' }, { status: 401 });

  } catch (error) {
    console.error('Error verifying admin user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 