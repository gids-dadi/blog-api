import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import config from '@/config';

// Models
import User from '@/models/user';
import { Types } from 'mongoose';

const getAllusers = async (req: Request, res: Response): Promise<void> => {
	try {
		const limit = Number(req.query.limit) || config.defaultResLimit;
		const offset = Number(req.query.offset) || config.defaultResOffset;
		const total = await User.countDocuments().exec();

		const users = await User.find().select('-__v').limit(limit).skip(offset).lean().exec();

		res.status(200).json({
			limit,
			offset,
			total,
			users,
		});
		logger.info(`All users fetched successfully`, users);
	} catch (error) {
		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server Error',
			error: error,
		});
		logger.error('Error fetching  users', error);
	}
};

export default getAllusers;
