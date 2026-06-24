const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        // Admin credentials
        const adminEmail = 'admin@civic.com';
        const adminPassword = 'admin123';
        const adminName = 'Admin User';

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log('⚠️ Admin user already exists!');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            await mongoose.disconnect();
            return;
        }

        // Create admin user
        const admin = await User.create({
            name: adminName,
            email: adminEmail,
            password: adminPassword,
            role: 'admin'
        });

        console.log('\n✨ Admin user created successfully!\n');
        console.log('📋 Use these credentials to login:\n');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}\n`);
        console.log('🔐 IMPORTANT: Change this password after first login!\n');

        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error('❌ Error creating admin:', err.message);
        process.exit(1);
    }
};

createAdmin();
