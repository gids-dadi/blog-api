import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import Like from '@/models/like';

const unlikeBlog = async (req: Request, res: Response): Promise<void> => {
	const { userId } = req.body;
	const { blogId } = req.params;
	try {
		const existingLike = await Like.findOne({ userId, blogId }).lean().exec();

		if (!existingLike) {
			res.status(400).json({
				code: 'BadRequest',
				message: 'You have already liked this blog',
			});
			return;
		}

		await Like.deleteOne({ _id: existingLike._id });
		const blog = await Blog.findById(blogId).select('likesCount').exec();

		if (!blog) {
			res.status(404).json({
				code: 'NotFound',
				message: 'Blog not found',
			});
			return;
		}
		blog.likesCount -= 1;
		await blog.save();
		logger.info('Blog unliked successfully', {
			blogId,
			userId,
			likesCount: blog.likesCount,
		});

		res.status(200).json({
			message: 'Blog unliked successfully',
			likesCount: blog.likesCount,
		});
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error during blog like', error);
	}
};

export default unlikeBlog;
