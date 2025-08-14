import type { Request, Response } from 'express';
import { logger } from '@/lib/winston';
import config from '@/config';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import type { IBlog } from '@/models/blog';
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import User from '@/models/user';

const deleteComment = async (req: Request, res: Response): Promise<void> => {
	try {
		const userId = req.userId;
		const { commentId } = req.params;

		const comment = await Comment.findById(commentId).select('userId blogId').lean().exec();
		const user = await User.findById(userId).select('role').lean().exec();
		const blog = await Blog.findById(comment?.blogId).select('commentsCount').exec();

		if (!blog) {
			res.status(404).json({
				code: 'NotFound',
				message: 'Blog not found',
			});
			return;
		}

		if (comment?.userId !== userId && user?.role !== 'admin') {
			res.status(403).json({
				code: 'AuthorizationError',
				message: 'You are not allowed to delete this comment',
			});

			logger.warn('Unauthorized attempt to delete comment', {
				userId,
				commentId,
			});
			return;
		}

		await Comment.deleteOne({ _id: commentId });
		logger.info('Comment deleted successfully', {
			commentId,
		});

		if (blog) {
			blog.commentsCount -= 1;
			await blog.save();
		}

		logger.info('Blog comments count updated after deletion', {
			blogId: blog?._id,
			commentsCount: blog?.commentsCount,
		});

		res.sendStatus(204);

		logger.info(` All comments retived`);
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error while deleting comment', error);
	}
};

export default deleteComment;
