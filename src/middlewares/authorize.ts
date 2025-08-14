import { logger } from '@/lib/winston';

import User from '@/models/user';
import type { Request, Response, NextFunction } from 'express';

export type AuthRole = 'user' | 'admin';

const authorize = (roles: AuthRole[]) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		const userId = req.userId;

		try {
			const user = await User.findById(userId).select('role').exec();

			if (!user) {
				res.status(404).json({
					code: 'NotFoundError',
					message: 'User not found',
				});
				return;
			}

			if (!roles.includes(user.role)) {
				res.status(403).json({
					code: 'AuthorizationError',
					message: 'You do not have permission to access this resource',
				});
				return;
			}
			return next();
		} catch (error) {
			res.status(500).json({
				code: 'ServerError',
				message: 'Internal Server Error',
        error: error,
			});
      logger.error('Error during authorization', error);  
		}
	};
};

export default authorize;
