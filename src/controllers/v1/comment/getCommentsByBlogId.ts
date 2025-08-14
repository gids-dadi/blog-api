import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import config from '@/config';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';
import Comment from '@/models/comment';

const getCommentsByBlogId = async (req: Request, res: Response): Promise<void> => {
	try {
		// const userId = req.userId;
		const { blogId } = req.params;

		const blog = await Blog.findById(blogId).select('_id').lean().exec();

		if (!blog) {
			res.status(404).json({
				code: 'NotFound',
				message: 'Blog not found',
			});
			return;
		}

		const allComments = await Comment.find({ blogId }).sort({ createdAt: -1 }).lean().exec();

		res.status(201).json({
			message: 'Blog created successfully',
			comments: allComments,
			code: 'success',
		});

		logger.info(` All comments retived`);
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error getting the comments for this blog', error);
	}
};

export default getCommentsByBlogId;
