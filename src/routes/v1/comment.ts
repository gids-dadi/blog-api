import { Router } from 'express';

const router = Router();
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import { body, param } from 'express-validator';
import commentOnBlog from '@/controllers/v1/comment/commentOnBlog';
import getCommentsByBlogId from '@/controllers/v1/comment/getCommentsByBlogId';
import deleteComment from '@/controllers/v1/comment/deleteComment';

router.post(
	'/blog/:blogId',
	authenticate,
	authorize(['user', 'admin']),
	param('blogId').isMongoId().withMessage('Invalid blog Id'),
	body('content').trim().notEmpty().isMongoId().withMessage('Content is required'),
	commentOnBlog
);

router.get(
	'/blog/:blogId',
	authenticate,
	authorize(['user', 'admin']),
	param('blogId').isMongoId().withMessage('Invalid blog Id'),
	getCommentsByBlogId
);

router.delete(
	'/:commentId',
	authenticate,
	authorize(['user', 'admin']),
	param('commentId').isMongoId().withMessage('Invalid comment Id'),
	deleteComment
);

export default router;
