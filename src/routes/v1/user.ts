import { Router } from 'express';
const router = Router();
import { param, query, body } from 'express-validator';

import { authenticate } from '@/middlewares/authenticate';
import validatorError from '@/middlewares/validationError';
import authorize from '@/middlewares/authorize';
// Controllers
import getCurrentUser from '@/controllers/v1/user/getCurrentUser';
import updateCurrentUser from '@/controllers/v1/user/updateCurrentUser';
import user from '@/models/user';
import deleteCurrentUser from '@/controllers/v1/user/deleteCurrentUser';
import getAllusers from '@/controllers/v1/user/getAllusers';
import getUserById from '@/controllers/v1/user/getUserById';
import deleteUserById from '@/controllers/v1/user/deleteUserById';

router.get('/current', authenticate, authorize(['user', 'admin']), getCurrentUser);

router.put(
	'/update',
	authenticate,
	authorize(['user', 'admin']),
	body('username')
		.optional()
		.trim()
		.isLength({ min: 3, max: 20 })
		.withMessage('Username must be between 3 and 20 characters')
		.custom(async (value) => {
			const userExists = await user.exists({ username: value });
			if (userExists) {
				throw new Error('Username already exists');
			}
		}),
	body('email')
		.optional()
		.isLength({ max: 50 })
		.withMessage('Email must be less than 50 characters')
		.isEmail()
		.withMessage('Invalid email format')
		.custom(async (value) => {
			const userExists = await user.exists({ email: value });
			if (userExists) {
				throw new Error('Email already exists');
			}
		}),
	body('password')
		.optional()
		.isLength({ max: 8 })
		.withMessage('Password must be less than 50 characters'),
	body('firstName')
		.optional()
		.isLength({ max: 20 })
		.withMessage('First name must be less than 20 characters'),
	body('lastName')
		.optional()
		.isLength({ max: 20 })
		.withMessage('Last name must be less than 20 characters'),
	body(['website', 'facebook', 'instagram', 'linkedin', 'x', 'youtube'])
		.optional()
		.isURL()
		.withMessage('Invalid URL format')
		.isLength({ max: 100 })
		.withMessage('URL must be less than 100 characters'),
	validatorError,
	updateCurrentUser
);

router.delete('/current', authenticate, authorize(['user', 'admin']), deleteCurrentUser);

router.get(
	'/current',
	authenticate,
	authorize(['admin']),
	query('limit')
		.optional()
		.isInt({ min: 1, max: 100 })
		.withMessage('Limit must be between 1 and 50'),
	query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
	validatorError,
	getAllusers
);

router.get(
	'/:userId',
	authenticate,
	authorize(['admin']),
	param('userId').notEmpty().isMongoId().withMessage('Invalid user ID format'),
	validatorError,
	getUserById
);

router.delete('/:userId', authenticate, authorize(['admin']), deleteUserById);

export default router;
