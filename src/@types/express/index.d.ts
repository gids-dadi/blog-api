import * as express from 'express';
import { Types } from 'mongoose';

declare global {
  namespace Express {
    interface Request {
      userId?: Types.ObjectId; // Optional userId property for authenticated requests
    }
  }
}
