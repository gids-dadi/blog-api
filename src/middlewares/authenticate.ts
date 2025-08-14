import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { verifyAccessToken } from '@/lib/jwt';

import { Request, Response, NextFunction } from 'express';
import { logger } from '@/lib/winston';
import { Types } from 'mongoose';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		res.status(401).json({
			code: 'AuthenticationError',
			message: 'No token provided',
		});
		return;
	}

	const [_, token] = authHeader.split(' ');

	try {
		const jwtPayload = verifyAccessToken(token) as { userId: Types.ObjectId };

		req.userId = jwtPayload.userId;
		next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			res.status(401).json({
				code: 'AuthenticationError',
				message: 'Token expired',
			});
			return;
		}

		if (error instanceof JsonWebTokenError) {
			res.status(401).json({
				code: 'AuthenticationError',
				message: 'Invalid token',
			});
			return;
		}

		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server Error',
			error: error,
		});
		logger.error('Error during authentication', error);
	}
};
