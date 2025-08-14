import { logger } from '@/lib/winston';
import config from '@/config';

import { Request, Response } from 'express';
import type { IUser } from '@/models/user';
import User from '@/models/user';
import Token from '@/models/token';
import { generateUsername } from '@/utils';
import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import token from '@/models/token';

type UserData = Pick<IUser, 'email' | 'password' | 'role'>;

const register = async (req: Request, res: Response) => {
	const { email, password, role }: UserData = req.body;

	if (role === 'admin' && !config.WHITELIST_ADMINS_MAILS.includes(email)) {
		res.status(403).json({
			code: 'AuthorizationError',
			message: 'You are not authorized to register as an admin',
		});

		logger.warn(`Unauthorized admin registration attempt by email: ${email}`);
		return;
	}

	try {
		const username = generateUsername();

		const newUser = await User.create({
			username,
			email,
			password,
			role,
		});

		const accesToken = generateAccessToken(newUser._id);
		const refreshToken = generateRefreshToken(newUser._id);
		await Token.create({
			userId: newUser._id,
			token: refreshToken,
		});
		logger.info('Refresh token created for user', {
			userId: newUser._id,
			token: refreshToken,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: config.NODE_ENV === 'production',
			sameSite: 'strict',
		});

		res.status(201).json({
			user: {
				username: newUser.username,
				email: newUser.email,
				role: newUser.role,
				isActive: newUser.isActive,
			},
			accessToken: accesToken,
		});
		logger.info(`User registered successfully:`, {
			username: newUser.username,
			email: newUser.email,
			role: newUser.role,
		});
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error during user registration', error);
	}
};

export default register;
