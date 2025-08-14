import jwt from 'jsonwebtoken';
import config from '@/config';
import { Types } from 'mongoose';

export const generateAccessToken = (userId: Types.ObjectId): string => {
	if (!config.JWT_ACCESS_SECRET) {
		throw new Error('JWT_ACCESS_SECRET is not defined in config');
	}
	return jwt.sign({ userId }, config.JWT_ACCESS_SECRET as string, {
		expiresIn: config.ACCESS_TOKEN_EXPIRY,
	});
};

export const generateRefreshToken = (userId: Types.ObjectId): string => {
	if (!config.JWT_REFRESH_SECRET) {
		throw new Error('JWT_REFRESH_SECRET is not defined in config');
	}
	return jwt.sign({ userId }, config.JWT_REFRESH_SECRET as string, {
		expiresIn: config.REFRESH_TOKEN_EXPIRY,
		subject: 'refreshToken',
	});
};

export const verifyAccessToken = (token: string) => {
	return jwt.verify(token, config.JWT_ACCESS_SECRET as string);
};

export const verifyRefreshToken = (token: string) => {
	return jwt.verify(token, config.JWT_REFRESH_SECRET as string);
};
