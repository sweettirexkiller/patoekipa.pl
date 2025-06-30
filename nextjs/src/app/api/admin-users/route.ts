import { NextRequest, NextResponse } from 'next/server';
import { getCosmosContainer } from '@/lib/cosmos';
import { AdminUser } from '@/lib/database-schema';
import { verifyAuth } from '@/lib/auth';

// Legacy whitelist for backward compatibility during migration
const LEGACY_ALLOWED_ADMIN_USERS = [
  'mozdowski',
  // Add other GitHub usernames here as needed
];

// Helper function to verify authentication using Azure App Service
async function verifyAdminAuth(request: NextRequest) {
  try {
    // Get the origin from the request to make internal calls
    const origin = request.headers.get('origin') || 'https://patoekipa-portfolio.azurewebsites.net';
    
    // Make internal call to /.auth/me to get authentication data
    const authResponse = await fetch(`${origin}/.auth/me`, {
      headers: {
        'Cookie': request.headers.get('Cookie') || '',
        'User-Agent': request.headers.get('User-Agent') || ''
      }
    });

    if (!authResponse.ok) {
      return { isAuthenticated: false, user: null };
    }

    const responseText = await authResponse.text();
    if (!responseText.trim()) {
      return { isAuthenticated: false, user: null };
    }

    let authData;
    try {
      authData = JSON.parse(responseText);
    } catch (parseError) {
      return { isAuthenticated: false, user: null };
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
      const container = getCosmosContainer();
      const { resources: users } = await container.items
        .query({
          query: "SELECT * FROM c WHERE c.type = 'admin_user' AND (c.githubUsername = @username OR c.githubUserId = @userId) AND c.isActive = true",
          parameters: [
            { name: '@username', value: username },
            { name: '@userId', value: userInfo.user_id }
          ]
        })
        .fetchAll();

      if (users.length > 0) {
        const adminUser: AdminUser = users[0];
        return {
          isAuthenticated: true,
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
          user: {
            githubUsername: username,
            githubUserId: userInfo.user_id,
            displayName: username,
            role: 'super_admin' as const,
            permissions: {
              canManageUsers: true,
              canManageProjects: true,
              canManageTeam: true,
              canManageTestimonials: true,
              canManageContacts: true,
            }
          }
        };
      }
    }

    return { isAuthenticated: false, user: null };
  } catch (error) {
    console.error('Error verifying admin auth:', error);
    return { isAuthenticated: false, user: null };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication and super_admin role
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthenticated || authResult.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const container = await getCosmosContainer();
    const { resources: adminUsers } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'admin_user' ORDER BY c.addedAt DESC"
      })
      .fetchAll();

    return NextResponse.json(adminUsers);
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication and super_admin role
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthenticated || authResult.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { githubUsername, githubUserId, displayName, email, role, permissions, notes } = body;

    // Validate required fields
    if (!githubUsername || !githubUserId || !displayName || !role) {
      return NextResponse.json({ 
        error: 'Missing required fields: githubUsername, githubUserId, displayName, role' 
      }, { status: 400 });
    }

    // Validate role
    if (!['super_admin', 'admin', 'editor'].includes(role)) {
      return NextResponse.json({ 
        error: 'Invalid role. Must be super_admin, admin, or editor' 
      }, { status: 400 });
    }

    const container = await getCosmosContainer();

    // Check if user already exists
    const { resources: existingUsers } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.type = 'admin_user' AND (c.githubUsername = @username OR c.githubUserId = @userId)",
        parameters: [
          { name: '@username', value: githubUsername },
          { name: '@userId', value: githubUserId }
        ]
      })
      .fetchAll();

    if (existingUsers.length > 0) {
      return NextResponse.json({ 
        error: 'User with this GitHub username or ID already exists' 
      }, { status: 409 });
    }

    const newAdminUser: AdminUser = {
      id: `admin_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'admin_user',
      githubUsername,
      githubUserId,
      displayName,
      email,
      role,
      isActive: true,
      addedBy: authResult.user!.githubUsername,
      addedAt: new Date().toISOString(),
      permissions: permissions || {
        canManageUsers: role === 'super_admin',
        canManageProjects: true,
        canManageTeam: true,
        canManageTestimonials: true,
        canManageContacts: true
      },
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const { resource: createdUser } = await container.items.create(newAdminUser);
    return NextResponse.json(createdUser, { status: 201 });
  } catch (error) {
    console.error('Error creating admin user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication and super_admin role
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthenticated || authResult.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, displayName, email, role, isActive, permissions, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const container = await getCosmosContainer();

    // Get existing user
    try {
      const { resource: existingUser } = await container.item(id, id).read<AdminUser>();
      
      if (!existingUser || existingUser.type !== 'admin_user') {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
      }

      // Prevent users from removing their own super_admin role if they're the last super_admin
      if (existingUser.githubUsername === authResult.user!.githubUsername && 
          existingUser.role === 'super_admin' && role !== 'super_admin') {
        const { resources: superAdmins } = await container.items
          .query({
            query: "SELECT * FROM c WHERE c.type = 'admin_user' AND c.role = 'super_admin' AND c.isActive = true"
          })
          .fetchAll();

        if (superAdmins.length <= 1) {
          return NextResponse.json({ 
            error: 'Cannot remove super_admin role - you are the last active super admin' 
          }, { status: 400 });
        }
      }

      const updatedUser: AdminUser = {
        ...existingUser,
        displayName: displayName || existingUser.displayName,
        email: email !== undefined ? email : existingUser.email,
        role: role || existingUser.role,
        isActive: isActive !== undefined ? isActive : existingUser.isActive,
        permissions: permissions || existingUser.permissions,
        notes: notes !== undefined ? notes : existingUser.notes,
        updatedAt: new Date().toISOString()
      };

      const { resource: result } = await container.item(id, id).replace(updatedUser);
      return NextResponse.json(result);
    } catch (error: any) {
      if (error.code === 404) {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating admin user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication and super_admin role
    const authResult = await verifyAdminAuth(request);
    if (!authResult.isAuthenticated || authResult.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing user ID' }, { status: 400 });
    }

    const container = await getCosmosContainer();

    try {
      const { resource: existingUser } = await container.item(id, id).read<AdminUser>();
      
      if (!existingUser || existingUser.type !== 'admin_user') {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
      }

      // Prevent users from deleting themselves if they're the last super_admin
      if (existingUser.githubUsername === authResult.user!.githubUsername && 
          existingUser.role === 'super_admin') {
        const { resources: superAdmins } = await container.items
          .query({
            query: "SELECT * FROM c WHERE c.type = 'admin_user' AND c.role = 'super_admin' AND c.isActive = true"
          })
          .fetchAll();

        if (superAdmins.length <= 1) {
          return NextResponse.json({ 
            error: 'Cannot delete yourself - you are the last active super admin' 
          }, { status: 400 });
        }
      }

      await container.item(id, id).delete();
      return NextResponse.json({ message: 'Admin user deleted successfully' });
    } catch (error: any) {
      if (error.code === 404) {
        return NextResponse.json({ error: 'Admin user not found' }, { status: 404 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error deleting admin user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 