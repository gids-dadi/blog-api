import { Router } from 'express';
import { body, cookie } from 'express-validator';
import bcrypt from 'bcryptjs';
const router = Router();

// Controllers
import register from '@/controllers/v1/auth/register';
import login from '@/controllers/v1/auth/login';
// Middleware
import validatorError from '@/middlewares/validationError';
import { authenticate } from '@/middlewares/authenticate';
// Models
import User from '@/models/user';
import refreshToken from '@/controllers/v1/auth/refresh-token';
import logout from '@/controllers/v1/auth/logout';

router.post(
	'/register',
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isLength({ max: 50 })
		.withMessage('Email must be less than 50 characters')
		.isEmail()
		.withMessage('invalid email address')
		.custom(async (value) => {
			const userExists = await User.exists({ email: value });
			if (userExists) {
				throw new Error('User email or password is invalid');
			}
		}),
	body('password')
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 8, max: 50 })
		.withMessage('Password must be between 8 and 50 characters'),
	body('role')
		.trim()
		.optional()
		.isString()
		.withMessage('Role must be a string')
		.isIn(['user', 'admin'])
		.withMessage('Role must be either "user" or "admin"'),
	validatorError,
	register
);

router.post(
	'/login',
	body('email')
		.trim()
		.notEmpty()
		.withMessage('Email is required')
		.isLength({ max: 50 })
		.withMessage('Email must be less than 50 characters')
		.isEmail()
		.withMessage('invalid email address')
		.custom(async (value) => {
			const userExists = await User.exists({ email: value });
			if (!userExists) {
				throw new Error('User email or password is invalid');
			}
		}),
	body('password')
		.trim()
		.notEmpty()
		.withMessage('Password is required')
		.isLength({ min: 8, max: 50 })
		.withMessage('Password must be between 8 and 50 characters')
		.custom(async (value, { req }) => {
			const { email } = req.body as { email: string };
			const user = await User.findOne({ email }).select('password').lean().exec();

			if (!user) {
				throw new Error('User email or password is invalid');
			}

			const passwordMatch = await bcrypt.compare(value, user.password);

			if (!passwordMatch) {
				throw new Error('User email or password is invalids');
			}
		}),
	validatorError,
	login
);

router.post(
	'/refresh-token',
	cookie('refreshToken')
		.notEmpty()
		.withMessage('Refresh token is required')
		.isJWT()
		.withMessage('Invalid refresh token format'),
	validatorError,

	refreshToken
);

router.post('/logout', authenticate, logout);

export default router;
