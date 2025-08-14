import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import config from '@/config';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';
import User from '@/models/user';

type BlogData = Partial<Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const updateBlog = async (req: Request, res: Response): Promise<void> => {
	try {
		const { title, content, banner, status } = req.body as BlogData;
		const userId = req.userId;
		const blogId = req.params.blogId;

		const user = await User.findById(userId).select('role').lean().exec();
		const blog = await Blog.findById(blogId).select('-__v').exec();

		if (!blog) {
			res.status(404).json({
				code: 'NotFound',
				message: 'Blog not found',
			});
			return;
		}

		if (blog.author !== userId && user?.role !== 'admin') {
			res.status(403).json({
				code: 'AuthorizationError',
				message: 'You do not have permission to update this blog',
			});
			logger.warn('Unauthorized blog update attempt', {
				userId,
				blogId,
			});
			return;
		}

		if (title) blog.title = title;
		if (content) blog.content = purify.sanitize(content);
		if (banner) blog.banner = banner;
		if (status) blog.status = status;

		await blog.save();
		logger.info(`Blog updated successfully`, { blog });

		res.status(200).json({
			blog,
		});
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error updating blog', error);
	}
};

export default updateBlog;
