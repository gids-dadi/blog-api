import { Router } from 'express';
const router = Router();
import { param, query, body } from 'express-validator';
import { authenticate } from '@/middlewares/authenticate';
import validatorError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
import createBlog from '@/controllers/v1/blog/createBlog';
import multer from 'multer';
import uploadBlogBanner from '@/middlewares/uploadBlogBanner';
import getAllBlogs from '@/controllers/v1/blog/getAllBlogs';
import getBlogsByUser from '@/controllers/v1/blog/getBlogsByUser';
import getBlogBySlug from '@/controllers/v1/blog/getBlogBySlug';
import updateBlog from '@/controllers/v1/blog/updateBlog';
import deleteBlog from '@/controllers/v1/blog/deleteBlog';

const upload = multer();

router.post(
	'/',
	authenticate,
	authorize(['admin']),
	upload.single('banner_image'),
	body('title')
		.trim()
		.notEmpty()
		.withMessage('Title is required')
		.isLength({ max: 150 })
		.withMessage('Title cannot exceed 150 characters'),
	body('content').trim().notEmpty().withMessage('Content is required'),
	body('status')
		.trim()
		.optional()
		.isIn(['draft', 'published'])
		.withMessage('Status must be either "draft" or "published"'),
	validatorError,
	uploadBlogBanner('post'),
	createBlog
);

router.get(
	'/',
	authenticate,
	authorize(['admin', 'user']),
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be between 1 and 50'),
	query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
	validatorError,
	getAllBlogs
);

router.get(
	'/user/:userId',
	authenticate,
	authorize(['admin', 'user']),
	param('userId').isMongoId().withMessage('Invalid user ID format'),
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be between 1 and 50'),
	query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
	validatorError,
	getBlogsByUser
);

router.get(
	'/:slug',
	authenticate,
	authorize(['admin', 'user']),
	param('slug').notEmpty().withMessage('Slug is required'),
	validatorError,
	getBlogBySlug
);

router.put(
	'/:blogId',
	authenticate,
	authorize(['admin']),
	param('blogId').isMongoId().withMessage('Invalid blog ID format'),
	upload.single('banner_image'),
	body('title').optional().isLength({ max: 150 }).withMessage('Title cannot exceed 150 characters'),
	body('content'),
	body('status')
		.optional()
		.isIn(['draft', 'published'])
		.withMessage('Status must be either "draft" or "published"'),
	validatorError,
	updateBlog
);

router.delete('/:blogId', authenticate, authorize(['admin']), deleteBlog);

export default router;
