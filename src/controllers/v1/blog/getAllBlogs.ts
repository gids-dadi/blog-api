import { logger } from '@/lib/winston';
import type { Request, Response } from 'express';
import config from '@/config';

// Models
import Blog from '@/models/blog';
import User from '@/models/user';

interface QueryTpe {
	status?: 'draft' | 'published';
}

const getAllBlogs = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.userId;
		const limit = Number(req.query.limit) || config.defaultResLimit;
		const offset = Number(req.query.offset) || config.defaultResOffset;

		const user = await User.findById(userId).select('role').lean().exec();
		const query: QueryTpe = {};

		if (user?.role === 'user') {
			query.status = 'published';
		}
		const total = await Blog.countDocuments(query).exec();

		const blogs = await Blog.find(query)
			.select('-banner.publicId -__v')
			.populate('author', '-createdAt -updatedAt -__v')
			.limit(limit)
			.skip(offset)
			.sort({ createdAt: -1 })
			.lean()
			.exec();

		res.status(200).json({
			limit,
			offset,
			total,
			blogs,
		});
		logger.info(`All blogs fetched successfully`, blogs);
	} catch (error) {
		res.status(500).json({
			code: 'ServerError',
			message: 'Internal Server Error',
			error: error,
		});
		logger.error('Error fetching  blogs', error);
	}
};

export default getAllBlogs;
