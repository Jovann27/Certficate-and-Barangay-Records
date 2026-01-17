const { getPool } = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const seedUsers = async () => {
  const pool = getPool();

  try {
    console.log('🌱 Starting user seeding...');

    // Sample users data
    const usersData = [
      {
        username: 'admin',
        email: 'admin@barangay.local',
        password: 'admin123',
        role: 'admin'
      },
      {
        username: 'staff1',
        email: 'staff1@barangay.local',
        password: 'staff123',
        role: 'staff'
      },
      {
        username: 'staff2',
        email: 'staff2@barangay.local',
        password: 'staff123',
        role: 'staff'
      }
    ];

    let createdCount = 0;
    let skippedCount = 0;

    for (const userData of usersData) {
      try {
        // Check if user already exists
        const existingUser = await User.findByUsername(userData.username);
        if (existingUser) {
          console.log(`⏭️  User '${userData.username}' already exists, skipping...`);
          skippedCount++;
          continue;
        }

        // Create new user
        await User.createUser(userData);
        console.log(`✅ Created user: ${userData.username} (${userData.role})`);
        createdCount++;

      } catch (error) {
        console.error(`❌ Error creating user '${userData.username}':`, error.message);
      }
    }

    console.log(`\n📊 Seeding completed:`);
    console.log(`   Created: ${createdCount} users`);
    console.log(`   Skipped: ${skippedCount} users`);
    console.log('\n🔐 Default credentials:');
    console.log('   Admin: admin / admin123');
    console.log('   Staff: staff1 / staff123, staff2 / staff123');

  } catch (error) {
    console.error('❌ Error during user seeding:', error);
    throw error;
  }
};

// Run seeder if called directly
if (require.main === module) {
  seedUsers()
    .then(() => {
      console.log('\n🎉 User seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 User seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedUsers };
