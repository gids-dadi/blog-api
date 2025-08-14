import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import config from '@/config';

// Models
import User from '@/models/user';
import { Types } from 'mongoose';

const getUserById = async (req: Request, res: Response): Promise<void> => {
 	const {userId} = req.params;
	try {
		const user = await User.findById(userId).select('-__v').lean().exec();

    if (!user) {
      res.status(404).json({
        code: 'UserNotFound',
        message: 'User not found',
      });
      return;
    }

		res.status(200).json({
			user,
		});
		logger.info(`The user fetched successfully`, user);
	} catch (error) {
		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server Error',
			error: error,
		});
		logger.error('Error fetching  user', error);
	}
};

export default getUserById;
