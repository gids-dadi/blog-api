import type { Request, Response } from 'express';
import { DOMPurify } from 'dompurify';
import { JSDOM } from 'jsdom';
import { logger } from '@/lib/winston';
import Blog from '@/models/blog';
import Comment from '@/models/comment';
import { IComment } from '@/models/comment';

type CommentData = Pick<IComment, 'content'>;

const window = new JSDOM('').window;
const purify = DOMPurify(window);

const commentOnBlog = async (req: Request, res: Response): Promise<void> => {
	const { content } = req.body as CommentData;
	const { blogId } = req.params;
	const userId = req.userId;
	try {
		const blog = await Blog.findById(blogId).select('_id commentsCount').exec();

		if (!blog) {
			res.status(404).json({
				code: 'NotFound',
				message: 'Blog not found',
			});
			return;
		}

		const cleanContent = purify.sanitize(content);

		const newComment = await Comment.create({
			blogId,
			content: cleanContent,
			userId,
		});

		blog.commentsCount += 1;
		await blog.save();

		logger.info('Blog comments count update', newComment);

		res.status(200).json({
			message: 'Blog liked successfully',
			likesCount: blog.commentsCount,
		});
	} catch (error) {
		res.status(500).json({
			code: 'serverError',
			message: 'Internal Server Error',
			error: 'error',
		});
		logger.error('Error creating comment for the blog', error);
	}
};

export default commentOnBlog;
