import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import config from '@/config';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const createBlog = async (req: Request, res: Response): Promise<void> => {
	try {
		const { title, content, banner, status } = req.body as BlogData;
		const userId = req.userId;

		const cleanContent = purify.sanitize(content);
		const newBlog = await Blog.create({
			title,
			content: cleanContent,
			banner,
			status,
			author: userId,
		});

		res.status(201).json({
			message: 'Blog created successfully',
			data: newBlog,
			code: 'success',
		});

		logger.info(`New blog created`, newBlog);
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error during blog creation', error);
	}
};

export default createBlog;
