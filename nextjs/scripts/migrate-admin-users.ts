import { cosmosOperations } from '../src/lib/cosmos';
import { AdminUser } from '../src/lib/database-schema';

// Legacy admin users to migrate
const LEGACY_ADMIN_USERS = [
  {
    githubUsername: 'mozdowski',
    githubUserId: '128164059',
    displayName: 'Mikolaj Ozdowski',
    email: '', // Optional
    role: 'super_admin' as const,
    notes: 'Migrated from legacy hardcoded list'
  },
  // Add other users as needed
];

async function migrateAdminUsers() {
  try {
    console.log('🔄 Starting admin users migration...');
    
    // Test database connection first
    const connectionTest = await cosmosOperations.getAllDocuments(1);
    if (!connectionTest.success) {
      throw new Error('Database connection failed');
    }
    console.log('✅ Database connection successful');
    
    for (const user of LEGACY_ADMIN_USERS) {
      console.log(`📝 Migrating user: ${user.githubUsername}`);
      
      // Check if user already exists
      const existingUserQuery = await cosmosOperations.queryDocuments(
        "SELECT * FROM c WHERE c.type = 'admin_user' AND c.githubUsername = @username",
        [{ name: '@username', value: user.githubUsername }]
      );

      if (existingUserQuery.success && existingUserQuery.data && existingUserQuery.data.length > 0) {
        console.log(`⚠️  User ${user.githubUsername} already exists in database, skipping...`);
        continue;
      }

      const adminUser: AdminUser = {
        id: `admin_user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'admin_user',
        githubUsername: user.githubUsername,
        githubUserId: user.githubUserId,
        displayName: user.displayName,
        email: user.email,
        role: user.role,
        isActive: true,
        addedBy: 'migration_script',
        addedAt: new Date().toISOString(),
        permissions: {
          canManageUsers: user.role === 'super_admin',
          canManageProjects: true,
          canManageTeam: true,
          canManageTestimonials: true,
          canManageContacts: true,
        },
        notes: user.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const result = await cosmosOperations.createDocument(adminUser);
      
      if (result.success) {
        console.log(`✅ Successfully migrated user: ${user.githubUsername} (ID: ${result.data?.id})`);
      } else {
        console.error(`❌ Failed to migrate user: ${user.githubUsername}`, result.error);
      }
    }
    
    console.log('🎉 Migration completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Test the admin panel to ensure authentication works');
    console.log('2. Add any additional admin users through the admin interface');
    console.log('3. Consider removing the legacy hardcoded list from auth.ts');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateAdminUsers()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration error:', error);
      process.exit(1);
    });
}

export { migrateAdminUsers }; 