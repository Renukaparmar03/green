import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { FoodUser } from '../src/core/users/user.model.js';
import { FoodDeliveryPartner } from '../src/modules/food/delivery/models/deliveryPartner.model.js';
import { FoodRestaurant } from '../src/modules/food/restaurant/models/restaurant.model.js';
import { FoodZone } from '../src/modules/food/admin/models/zone.model.js';

const seedAllEntities = async () => {
    try {
        await connectDB();

        const phone = '9755633147';

        // 1. Get or Create Indore Zone
        let indoreZone = await FoodZone.findOne({
            $or: [
                { name: { $regex: /indore/i } },
                { zoneName: { $regex: /indore/i } },
                { serviceLocation: { $regex: /indore/i } }
            ]
        });

        if (!indoreZone) {
            console.log('Indore zone not found. Creating Indore Zone...');
            indoreZone = await FoodZone.create({
                name: 'Indore Zone',
                zoneName: 'Indore',
                country: 'India',
                serviceLocation: 'Indore',
                unit: 'kilometer',
                coordinates: [
                    { latitude: 22.65, longitude: 75.80 },
                    { latitude: 22.65, longitude: 75.95 },
                    { latitude: 22.80, longitude: 75.95 },
                    { latitude: 22.80, longitude: 75.80 },
                    { latitude: 22.65, longitude: 75.80 }
                ],
                centerPoint: {
                    latitude: 22.7196,
                    longitude: 75.8577
                },
                serviceRadius: 25,
                isRadiusEnabled: true,
                isActive: true
            });
            console.log(`✅ Indore Zone created with ID: ${indoreZone._id}`);
        } else {
            console.log(`✅ Found existing Indore Zone with ID: ${indoreZone._id}`);
        }

        // 2. Create or Update User (Customer)
        let user = await FoodUser.findOne({ phone });
        if (user) {
            user.name = 'rituraj';
            user.isVerified = true;
            user.isActive = true;
            await user.save();
            console.log(`✅ Existing User updated (Name: rituraj, Phone: ${phone})`);
        } else {
            user = await FoodUser.create({
                phone,
                name: 'rituraj',
                isVerified: true,
                isActive: true,
                role: 'USER'
            });
            console.log(`✅ New User created (Name: rituraj, Phone: ${phone})`);
        }

        // 3. Create or Update Delivery Partner (Delivery Boy)
        let deliveryBoy = await FoodDeliveryPartner.findOne({ phone });
        if (deliveryBoy) {
            deliveryBoy.name = 'rituraj';
            deliveryBoy.status = 'approved';
            deliveryBoy.availabilityStatus = 'online';
            deliveryBoy.city = 'Indore';
            deliveryBoy.state = 'Madhya Pradesh';
            await deliveryBoy.save();
            console.log(`✅ Existing Delivery Partner updated (Name: rituraj, Phone: ${phone})`);
        } else {
            deliveryBoy = await FoodDeliveryPartner.create({
                phone,
                name: 'rituraj',
                city: 'Indore',
                state: 'Madhya Pradesh',
                status: 'approved',
                availabilityStatus: 'online',
                vehicleType: 'Bike'
            });
            console.log(`✅ New Delivery Partner created (Name: rituraj, Phone: ${phone})`);
        }

        // 4. Create or Update Restaurant (renukas kitchen) in Indore Zone
        const restaurantName = 'renukas kitchen';
        let restaurant = await FoodRestaurant.findOne({
            $or: [
                { ownerPhone: phone },
                { primaryContactNumber: phone },
                { restaurantName: { $regex: new RegExp(`^${restaurantName}$`, 'i') } }
            ]
        });

        const indoreLocation = {
            type: 'Point',
            coordinates: [75.8577, 22.7196],
            latitude: 22.7196,
            longitude: 75.8577,
            city: 'Indore',
            state: 'Madhya Pradesh',
            addressLine1: 'Indore Main Market',
            area: 'Indore Central'
        };

        if (restaurant) {
            restaurant.restaurantName = restaurantName;
            restaurant.ownerName = 'rituraj';
            restaurant.ownerPhone = phone;
            restaurant.primaryContactNumber = phone;
            restaurant.status = 'approved';
            restaurant.isAcceptingOrders = true;
            restaurant.zoneId = indoreZone._id;
            restaurant.city = 'Indore';
            restaurant.state = 'Madhya Pradesh';
            restaurant.location = indoreLocation;
            await restaurant.save();
            console.log(`✅ Existing Restaurant updated (Name: ${restaurantName}, Zone: Indore)`);
        } else {
            restaurant = await FoodRestaurant.create({
                restaurantName: restaurantName,
                ownerName: 'rituraj',
                ownerPhone: phone,
                primaryContactNumber: phone,
                status: 'approved',
                isAcceptingOrders: true,
                pureVegRestaurant: true,
                zoneId: indoreZone._id,
                city: 'Indore',
                state: 'Madhya Pradesh',
                addressLine1: 'Indore Main Market',
                area: 'Indore Central',
                openingTime: '09:00',
                closingTime: '23:00',
                openDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                location: indoreLocation
            });
            console.log(`✅ New Restaurant created (Name: ${restaurantName}, Zone: Indore)`);
        }

        console.log('\n================ SUMMARY ================');
        console.log(`Indore Zone ID:     ${indoreZone._id}`);
        console.log(`User ID:            ${user._id} (Name: ${user.name}, Phone: ${user.phone})`);
        console.log(`Delivery Partner:   ${deliveryBoy._id} (Name: ${deliveryBoy.name}, Phone: ${deliveryBoy.phone}, Status: ${deliveryBoy.status})`);
        console.log(`Restaurant ID:      ${restaurant._id} (Name: ${restaurant.restaurantName}, Zone: Indore, Status: ${restaurant.status})`);
        console.log('=========================================\n');

    } catch (error) {
        console.error('❌ Error seeding entities:', error);
    } finally {
        await disconnectDB();
        process.exit(0);
    }
};

seedAllEntities();
