import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compress from 'compression';
import helmet from 'helmet';
import type { CorsOptions } from 'cors';
import config from '@/config';
import limiter from '@/lib/express_rate_limit';
import { connectToDatabase, disconnectFromDatabase } from '@/lib/mongoose';
import { logger } from '@/lib/winston';
import v1Routes from '@/routes/v1/index';

const app = express();

// Configure Cors
const corsOptions: CorsOptions = {
	origin(origin, callback) {
		if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error(`Cors error: ${origin} is not allowed by CORS `), false);
			logger.warn(`Cors error: ${origin} is not allowed by CORS`);
		}
	},
};

app.use(cors(corsOptions));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	compress({
		threshold: 1024, // Compress responses larger than 1KB
	})
);

app.use(helmet());
app.use(limiter);

(async () => {
	try {
		await connectToDatabase();
		app.use('/api/v1', v1Routes);

		app.listen(config.PORT, () => {
			logger.info(`Server is running on http://localhost:${config.PORT}`);
		});
	} catch (error) {
		logger.error('Error during server initialization:', error);
		process.exit(1);
	}
})();

const handleServerShutdown = async () => {
	try {
		await disconnectFromDatabase();
		logger.info('Server SHUTDOWN Gracefully');
		process.exit(0);
	} catch (error) {
		logger.error('Error during server shutdown:', error);
	} finally {
		process.exit(0);
	}
};

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);
