import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';

// Models
import User from '@/models/user';

const updateCurrentUser = async (req: Request, res: Response): Promise<void> => {
	const userId = req.userId;

	const {
		username,
		email,
		password,
		firstName,
		lastName,
		website,
		facebook,
		instagram,
		linkedin,
		x,
		youtube,
	} = req.body;

	try {
		const user = await User.findById(userId).select('+password -__v').exec();

		if (!user) {
			res.status(404).json({
				code: 'UserNotFound',
				message: 'User not found',
			});
			return;
		}

		if (username) user.username = username;
		if (email) user.email = email;
		if (password) user.password = password;
		if (firstName) user.firstName = firstName;
		if (lastName) user.lastName = lastName;
		if (!user.socialLinks) {
			user.socialLinks = {};
		}
		if (website) user.socialLinks.website = website;
		if (facebook) user.socialLinks.facebook = facebook;
		if (instagram) user.socialLinks.instagram = instagram;
		if (linkedin) user.socialLinks.linkedIn = linkedin;
		if (x) user.socialLinks.x = x;
		if (youtube) user.socialLinks.youtube = youtube;

		await user.save();
		logger.info(`Current user fetched successfully`, user);
		res.status(200).json({
			user,
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

export default updateCurrentUser;
