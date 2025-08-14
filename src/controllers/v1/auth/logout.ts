import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import config from '@/config';

// Models
import Token from '@/models/token';

const logout = async (req: Request, res: Response): Promise<void> => {
	try {
		const refreshToken = req.cookies.refreshToken as string;

		if(refreshToken) {
			await Token.deleteOne({ token: refreshToken });

			logger.info('Refresh token deleted from DB', {
				token: refreshToken,
				userId: req.userId,
			});
		}

		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: config.NODE_ENV === 'production',
			sameSite: 'strict',
		});
		res.sendStatus(204);

		logger.info(`User logout successfully:`, {
			userId: req.userId,
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

export default logout;
