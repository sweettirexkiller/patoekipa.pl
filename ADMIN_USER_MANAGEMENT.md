# Admin User Management System

This document describes the database-driven admin user management system implemented for the Patoekipa portfolio application.

## Overview

The admin user management system allows for dynamic management of admin users through a database-driven approach, replacing the previous hardcoded whitelist. This provides better security, auditability, and flexibility.

## Features

- **Role-based Access Control**: Three roles - `super_admin`, `admin`, and `editor`
- **Granular Permissions**: Fine-grained permissions for different admin functions
- **Database-driven**: All admin users stored in Cosmos DB
- **Audit Trail**: Track when users were added, by whom, and last login times
- **Self-service Management**: Super admins can manage other admin users through the UI
- **Legacy Compatibility**: Fallback to hardcoded list during migration period

## User Roles

### Super Admin (`super_admin`)
- Can manage other admin users (create, edit, delete)
- Can manage all content (team, projects, testimonials, contacts)
- Cannot delete themselves if they're the last super admin
- Cannot remove their own super admin role if they're the last one

### Admin (`admin`)
- Can manage all content except other admin users
- Full access to team, projects, testimonials, and contacts management

### Editor (`editor`)
- Can manage content based on specific permissions
- Default permissions include all content management except user management

## Database Schema

```typescript
interface AdminUser extends BaseDocument {
  type: 'admin_user';
  githubUsername: string;
  githubUserId: string;
  displayName: string;
  email?: string;
  role: 'super_admin' | 'admin' | 'editor';
  isActive: boolean;
  lastLoginAt?: string;
  addedBy: string;
  addedAt: string;
  permissions?: {
    canManageUsers?: boolean;
    canManageProjects?: boolean;
    canManageTeam?: boolean;
    canManageTestimonials?: boolean;
    canManageContacts?: boolean;
  };
  notes?: string;
}
```

## API Endpoints

### GET /api/admin-users
- **Access**: Super Admin only
- **Description**: Retrieve all admin users
- **Response**: Array of AdminUser objects

### POST /api/admin-users
- **Access**: Super Admin only
- **Description**: Create a new admin user
- **Body**: AdminUser data (without id, timestamps)
- **Validation**: Checks for duplicate GitHub username/ID

### PUT /api/admin-users
- **Access**: Super Admin only
- **Description**: Update an existing admin user
- **Body**: Partial AdminUser data with id
- **Protection**: Prevents last super admin from demoting themselves

### DELETE /api/admin-users?id={id}
- **Access**: Super Admin only
- **Description**: Delete an admin user
- **Protection**: Prevents last super admin from deleting themselves

## Setup and Migration

### 1. Initial Setup

The system is already integrated into the existing admin panel. No additional setup is required.

### 2. Migration from Hardcoded List

To migrate existing hardcoded admin users to the database:

```bash
cd nextjs
npm run migrate:admin-users
```

This will:
- Read the legacy hardcoded user list
- Create corresponding database entries
- Skip users that already exist in the database
- Provide migration status and next steps

### 3. Manual Migration

You can also manually add admin users through the admin panel:

1. Login to the admin panel as an existing super admin
2. Navigate to "Administratorzy" (Admin Users) section
3. Click "Add Admin User"
4. Fill in the required information:
   - GitHub Username (required)
   - GitHub User ID (required - can be found at `https://api.github.com/users/{username}`)
   - Display Name (required)
   - Email (optional)
   - Role (required)
   - Permissions (auto-configured based on role)
   - Notes (optional)

## Usage

### Admin Panel Access

1. **Navigation**: The admin users management is available in the admin panel sidebar as "Administratorzy"
2. **Access Control**: Only visible to users with `super_admin` role
3. **Features**:
   - View all admin users with their roles and status
   - Add new admin users
   - Edit existing admin users
   - Activate/deactivate users
   - Delete users (with protection for last super admin)

### Finding GitHub User ID

To add a new admin user, you need their GitHub User ID:

1. Visit: `https://api.github.com/users/{github-username}`
2. Look for the `id` field in the JSON response
3. Use this numeric ID when creating the admin user

Example:
```bash
curl https://api.github.com/users/mozdowski
# Returns: {"id": 128164059, "login": "mozdowski", ...}
```

## Authentication Flow

1. **Azure App Service Authentication**: Users authenticate via GitHub OAuth
2. **Database Lookup**: System checks if authenticated user exists in admin_users table
3. **Legacy Fallback**: If not found in database, falls back to hardcoded list (during migration)
4. **Role Assignment**: User gets role and permissions from database record
5. **Session Management**: Last login time is updated on each authentication

## Security Features

- **Role-based Authorization**: Each API endpoint checks user role
- **Self-protection**: Super admins cannot delete themselves or remove their role if they're the last one
- **Audit Trail**: Track who added users and when they last logged in
- **Active Status**: Users can be deactivated without deletion
- **GitHub Integration**: Leverages GitHub's OAuth for secure authentication

## File Structure

```
nextjs/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── page.tsx                 # Updated admin panel with user management
│   │   └── api/
│   │       └── admin-users/
│   │           └── route.ts             # Admin user CRUD API
│   ├── components/
│   │   └── admin/
│   │       └── AdminUsersManagement.tsx # Admin user management UI
│   └── lib/
│       ├── auth.ts                      # Updated authentication with database lookup
│       ├── cosmos.ts                    # Updated with getCosmosContainer export
│       └── database-schema.ts           # Updated with AdminUser interface
├── scripts/
│   └── migrate-admin-users.ts           # Migration script
└── package.json                         # Updated with migration script
```

## Troubleshooting

### Common Issues

1. **"Access Denied" in Admin Users section**
   - Ensure you have `super_admin` role
   - Check if you're properly authenticated
   - Verify your user exists in the database

2. **Cannot add user - "User already exists"**
   - Check if the GitHub username or ID is already in the database
   - GitHub usernames and IDs must be unique

3. **Cannot delete/modify last super admin**
   - This is by design for security
   - Add another super admin first, then modify the original

4. **Migration script fails**
   - Ensure Cosmos DB connection is properly configured
   - Check environment variables are set
   - Verify the database and container exist

### Debugging

Enable debug logging by checking the browser console and server logs:

```javascript
// In browser console, check for auth responses
console.log('Auth response:', authData);

// Server logs will show authentication attempts
console.log('Auth verification error:', error);
```

## Future Enhancements

Potential improvements for the admin user management system:

1. **Email Notifications**: Notify users when they're added/removed
2. **Session Management**: Track active sessions and allow forced logout
3. **Permission Templates**: Create permission templates for common roles
4. **Bulk Operations**: Import/export admin users
5. **Activity Logging**: Detailed audit logs of admin actions
6. **Two-Factor Authentication**: Additional security layer
7. **API Keys**: Allow programmatic access with API keys

## Migration Checklist

When migrating to the new system:

- [ ] Run migration script: `npm run migrate:admin-users`
- [ ] Test admin panel access with existing users
- [ ] Add any missing admin users through the UI
- [ ] Verify all admin functions work correctly
- [ ] Test role-based permissions
- [ ] Remove legacy hardcoded list from `auth.ts` (optional)
- [ ] Update documentation and team procedures

## Support

For issues or questions about the admin user management system:

1. Check this documentation first
2. Review the browser console and server logs
3. Test with a known working admin user
4. Check the GitHub Issues for similar problems
5. Contact the development team with specific error messages and steps to reproduce 