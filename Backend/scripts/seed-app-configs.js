import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../src/config/db.js';
import { AppConfig } from '../src/core/appConfig/appConfig.model.js';

const seedAppConfigs = async () => {
    try {
        await connectDB();

        const apps = ['user_app', 'delivery_app', 'restaurant_app', 'admin_app'];

        for (const appName of apps) {
            let config = await AppConfig.findOne({ appName });
            if (!config) {
                config = await AppConfig.create({ appName });
                console.log(`✅ Seeded config for: ${appName}`);
            } else {
                console.log(`ℹ️ Config already exists for: ${appName}`);
            }
        }
    } catch (error) {
        console.error('❌ Error seeding app configs:', error);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
};

seedAppConfigs();
