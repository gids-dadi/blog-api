import dotenv from 'dotenv';
dotenv.config();

const config = {
	PORT: process.env.PORT || 3000,
	NODE_ENV: process.env.NODE_ENV || 'development',
	WHITELIST_ORIGINS: ['http://localhost:3000', 'https://example.com'],
	MONGO_URI: process.env.MONGO_URI,
	LOG_LEVEL: process.env.LOG_LEVEL || 'info',
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
	REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
	WHITELIST_ADMINS_MAILS: ['gideons564@gmail.com'],
	defaultResLimit: 20,
	defaultResOffset: 0,
	CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
	CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
	CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

export default config;
