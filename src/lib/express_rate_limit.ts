import { rateLimit } from 'express-rate-limit';
import config from '@/config';

const limiter = rateLimit({
	windowMs: 60000, // 1 minute in milliseconds
	limit: 60, // Limit each IP to 100 requests per windowMs
	standardHeaders: 'draft-8',
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
	message: {
		status: 429,
		error: 'Too Many Requests, Please try again later.',
	},
});

export default limiter;
