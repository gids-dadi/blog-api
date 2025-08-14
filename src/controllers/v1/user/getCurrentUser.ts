import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';

// Models
import User from '@/models/user';
import { Types } from 'mongoose';

const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.userId;

		const user = await User.findById(userId).select('-__v').lean().exec();

		res.status(200).json({
			user,
		});
		logger.info(`Current user fetched successfully`, {
			userId: userId,
		});
	} catch (error) {
		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server Error',
			error: error,
		});
		logger.error('Error fetching current user', error);
	}
};

export default getCurrentUser;
