import type { Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { logger } from '@/lib/winston';
import config from '@/config';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';
import User from '@/models/user';

type BlogData = Pick<IBlog, 'title' | 'content' | 'banner' | 'status'>;

const deleteBlog = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.userId;
		const blogId = req.params.blogId;

		const user = await User.findById(userId).select('role').lean().exec();
		const blog = await Blog.findById(blogId).select('author banner.publicId').lean().exec();

		if (!blog) {
			res.status(404).json({
				code: 'NotFound',
				message: 'Blog not found',
			});
			return;
		}

		if (blog.author !== userId && user?.role !== 'admin') {
			res.status(403).json({
				code: 'Forbidden',
				message: 'You are not allowed to delete this blog',
			});
			logger.warn(`User ${userId} attempted to delete blog ${blogId} without permission`);
			return;
		}

		await cloudinary.uploader.destroy(blog.banner.publicId);
		logger.info(`Blog banner deleted from Cloudinary`, {
			publicId: blog.banner.publicId,
		});

		await Blog.deleteMany({ _id: blogId }).exec();
		logger.info(`Blog deleted successfully`, {
			blogId,
		});

		res.status(200).json({
			message: 'Blog deleted successfully',
			code: 'success',
		});
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error deleting blog', error);
	}
};

export default deleteBlog;
