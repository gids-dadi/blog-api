import { Router } from 'express';

const router = Router();
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import likeBlog from '@/controllers/v1/like/likeBlog';
import { body, param } from 'express-validator';
import unlikeBlog from '@/controllers/v1/like/unlikeBlog';
import commentOnBlog from '@/controllers/v1/comment/commentOnBlog';

router.post(
	'/blog/:blogId',
	authenticate,
	authorize(['user', 'admin']),
	param('blogId').isMongoId().withMessage('Invalid blog Id'),
	body('content').trim().notEmpty().isMongoId().withMessage('Content is required'),
	commentOnBlog
);

export default router;
