import { generateAccessToken, generateRefreshToken } from '@/lib/jwt';
import { logger } from '@/lib/winston';
import config from '@/config';

import User from '@/models/user';
import Token from '@/models/token';

import type { Request, Response } from 'express';
import type { IUser } from '@/models/user';

type UserData = Pick<IUser, 'email' | 'password'>;

const login = async (req: Request, res: Response): Promise<void> => {
	try {
		const { email } = req.body as UserData;
		const user = await User.findOne({ email })
			.select('username email password role isActive')
			.lean()
			.exec();

		if (!user) {
			res.status(404).json({
				code: 'NotFound',
				message: 'User not found',
			});
			logger.warn(`Unauthorized login attempt by email: ${email}`);
			return;
		}

		const accesToken = generateAccessToken(user._id);
		const refreshToken = generateRefreshToken(user._id);
		await Token.create({
			userId: user._id,
			token: refreshToken,
		});

		logger.info('Refresh token created for user', {
			userId: user._id,
			token: refreshToken,
		});

		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: config.NODE_ENV === 'production',
			sameSite: 'strict',
		});

		res.status(201).json({
			user: {
				username: user.username,
				email: user.email,
				role: user.role,
				isActive: user.isActive,
			},
			accessToken: accesToken,
		});
		logger.info(`User login successfully:`, user);
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error during user registration', error);
	}
};

export default login;
