import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import { Types } from 'mongoose';

// Models
import Token from '@/models/token';
import { generateAccessToken, verifyAccessToken, verifyRefreshToken } from '@/lib/jwt';

const refreshToken = async (req: Request, res: Response): Promise<void> => {
	const refreshToken = req.cookies.refreshToken as string;
	console.log('refreshToken', refreshToken);

	try {
		// check if refresh token is exists in DB
		const tokenExist = await Token.exists({ token: refreshToken });

		if (!tokenExist) {
			res.status(401).json({
				code: 'AuthenticationError',
				message: 'Invalid refresh token',
			});
		}

		const jwtPayload = verifyRefreshToken(refreshToken) as { userId: Types.ObjectId };
		console.log('jwtPayload', jwtPayload);

		const accessToken = generateAccessToken(jwtPayload.userId);

		res.status(200).json({
			accessToken: accessToken,
		});
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			console.log('TokenExpiredError', error);
			res.status(401).json({
				code: 'AuthenticatonError',
				message: 'Refresh token expired',
			});
			return;
		}

		if (error instanceof JsonWebTokenError) {
			res.status(401).json({
				code: 'AuthenticatonError',
				message: 'Invalid refresh token',
			});
			return;
		}

		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server error',
			error,
		});
		logger.error('Error during refresh token', error);
	}
};

export default refreshToken;
