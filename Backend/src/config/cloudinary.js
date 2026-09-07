import { v2 as cloudinary } from 'cloudinary';
import { config } from './env.js';

cloudinary.config({
    cloud_name: config.cloudinaryCloudName || process.env.CLOUDINARY_CLOUD_NAME,
    api_key: config.cloudinaryApiKey || process.env.CLOUDINARY_API_KEY,
    api_secret: config.cloudinaryApiSecret || process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export const isCloudinaryConfigured = () => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || config.cloudinaryCloudName;
    const apiKey = process.env.CLOUDINARY_API_KEY || config.cloudinaryApiKey;
    const apiSecret = process.env.CLOUDINARY_API_SECRET || config.cloudinaryApiSecret;
    return Boolean(cloudName && apiKey && apiSecret);
};

export default cloudinary;
