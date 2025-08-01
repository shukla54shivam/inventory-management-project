const bcrypt = require('bcryptjs');
const { runQuery, getRow } = require('../db');
require('dotenv').config();

async function createAdminUser() {
  try {
    const adminUsername = 'admin';
    const adminPassword = 'admin123';
    const adminEmail = 'admin@ims.com';

    // Check if admin already exists
    const existingAdmin = await getRow('SELECT id FROM users WHERE username = ?', [adminUsername]);
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Create admin user
    const result = await runQuery(
      'INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)',
      [adminUsername, hashedPassword, adminEmail, 'admin']
    );

    console.log('✅ Admin user created successfully!');
    console.log('📧 Username:', adminUsername);
    console.log('🔑 Password:', adminPassword);
    console.log('👤 Role: admin');
    console.log('🆔 User ID:', result.id);

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run the script
createAdminUser().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
}); 