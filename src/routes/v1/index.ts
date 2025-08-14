import { Router } from 'express';
const router = Router();
import authRoutes from '@/routes/v1/auth';
import userRoutes from '@/routes/v1/user';
import blogRoutes from '@/routes/v1/blog';

// Define your test route here
router.get('/', (req, res) => {
	res.status(200).json({
		message: 'Api is Live!!',
		status: 'success',
		version: '1.0.0',
		timeStamp: new Date().toISOString(),
	});
	console.log('Index routes');
});

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/blogs', blogRoutes);

export default router;
