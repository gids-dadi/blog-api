import { Router } from 'express';

const router = Router();
import { authenticate } from '@/middlewares/authenticate';
import authorize from '@/middlewares/authorize';
import likeBlog from '@/controllers/v1/like/likeBlog';
import { body, param } from 'express-validator';
import unlikeBlog from '@/controllers/v1/like/unlikeBlog';

router.post(
	'/blogs/:blogId',
	authenticate,
	authorize(['user', 'admin']),
	param('blogId').isMongoId().withMessage('Invalid blog Id'),
	body('userId').notEmpty().isMongoId().withMessage('Invalid user Id'),
	likeBlog
);

router.post(
	'/blogs/:blogId',
	authenticate,
	authorize(['user', 'admin']),
	param('blogId').isMongoId().withMessage('Invalid blog Id'),
	body('userId').notEmpty().isMongoId().withMessage('Invalid user Id'),
	unlikeBlog
);

export default router;
