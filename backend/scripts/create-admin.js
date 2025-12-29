require('../src/config/env');
const bcrypt = require('bcrypt');
const User = require('../src/models/User');
const { connectDB, disconnectDB } = require('../src/config/db');

const createAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Connected to database\n');

    const email = 'admin@example.com';
    const password = 'admin.local@example.com';
    const first_name = 'Admin';
    const last_name = 'User';

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Role: ${existingAdmin.role}`);
      console.log('\nTo update the password, delete the user first or update manually.\n');
      await disconnectDB();
      process.exit(0);
    }

    // Hash password
    console.log('Hashing password...');
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create admin user
    console.log('Creating admin user...');
    const admin = await User.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`   Email: ${admin.email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role: ${admin.role}`);
    console.log(`   Name: ${admin.first_name} ${admin.last_name}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Close connection
    await disconnectDB();
    console.log('✓ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    if (error.code === 11000) {
      console.error('   User with this email already exists!');
    }
    await disconnectDB();
    process.exit(1);
  }
};

// Run script
createAdmin();

