import { Request, Response, NextFunction } from 'express';
import { Toolbox } from '../utils/tools';
import { mongoUserService } from '../service/mongo';
import { ResponseUtils } from '../utils/reponse';
import { StatusCode } from '../types/response';
import { mongoose } from '../config/db';
import { IUser } from '../types/user';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

class AuthMiddleware {
  public async authenticate(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers.authorization;
    if (!token) {
      ResponseUtils.error(res, 'No token provided', StatusCode.UNAUTHORIZED);
      return;
    }

    try {
      const decoded = await Toolbox.verifyToken(token);
      if (!decoded || !decoded.userId) {
        ResponseUtils.error(res, 'Invalid token', StatusCode.UNAUTHORIZED);
        return;
      }

      const UserID = new mongoose.Types.ObjectId(decoded.userId);
      const user = await mongoUserService.findById(UserID);

      if (!user.status || !user.data) {
        ResponseUtils.error(res, 'User not found', StatusCode.UNAUTHORIZED);
        return;
      }

      req.user = user.data; 
      next();
    } catch (error) {
      console.error('Authentication error:', error);
      ResponseUtils.error(res, 'Unauthorized', StatusCode.UNAUTHORIZED);
    }
  }
}

export const authMiddleware = new AuthMiddleware();
