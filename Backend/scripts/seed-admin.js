import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { FoodAdmin } from '../src/core/admin/admin.model.js';

const seedAdmin = async () => {
    try {
        await connectDB();

        const email = process.env.ADMIN_SEED_EMAIL || 'admin@green.com';
        const password = process.env.ADMIN_SEED_PASSWORD || 'admin123456';
        const name = process.env.ADMIN_SEED_NAME || 'Super Admin';
        const phone = process.env.ADMIN_SEED_PHONE || '9999999999';

        let admin = await FoodAdmin.findOne({ email });

        if (admin) {
            console.log(`Found existing admin with email: ${email}`);
            admin.password = password;
            admin.visiblePassword = password;
            admin.name = name;
            admin.phone = phone;
            admin.role = 'SUPER_ADMIN';
            admin.isActive = true;
            admin.servicesAccess = ['food', 'quickCommerce', 'taxi'];
            await admin.save();
            console.log('✅ Existing admin password and permissions updated successfully!');
        } else {
            admin = await FoodAdmin.create({
                email,
                password,
                visiblePassword: password,
                name,
                phone,
                role: 'SUPER_ADMIN',
                isActive: true,
                servicesAccess: ['food', 'quickCommerce', 'taxi']
            });
            console.log('✅ New Admin created successfully!');
        }

        console.log('-----------------------------------');
        console.log(`Admin ID:       ${admin._id}`);
        console.log(`Email:          ${admin.email}`);
        console.log(`Password:       ${password}`);
        console.log(`Role:           ${admin.role}`);
        console.log(`Services:       ${admin.servicesAccess.join(', ')}`);
        console.log('-----------------------------------');

    } catch (error) {
        console.error('❌ Error seeding admin:', error);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
};

seedAdmin();
