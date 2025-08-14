import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';

// Models
import User from '@/models/user';
import Blog from '@/models/blog';

const deleteUserById = async (req: Request, res: Response): Promise<void> => {
	const userId = req.params.userId;

	try {
		const blogs = await Blog.find({ author: userId }).select('banner.publicId').lean().exec();

		const publicIds = blogs.map(({ banner }) => banner.publicId);
		await cloudinary.api.delete_resources(publicIds);

		logger.info('Multiple blog banners deleted from Cloudinary', {
			publicIds,
		});

		await Blog.deleteMany({ author: userId }).exec();
		logger.info(`All blogs by user deleted successfully`, { userId, blogs });

		await User.deleteOne({ _id: userId }).exec();
		logger.info(`Current user deleted successfully`, { userId });

		res.status(204).send();
	} catch (error) {
		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server Error',
			error: error,
		});
		logger.error('Error deleting current user', error);
	}
};

export default deleteUserById;
