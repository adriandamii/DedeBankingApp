import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorHandler from './ErrorHandler';

dotenv.config();

export const authenticateToken = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const publicRoutes = [
        '/user/set-pin',
        '/user/login-customer',
        '/user/reset-pin',
        '/user/forgot-pin',
        '/admin/create-admin',
        '/admin/send-login-password',
        '/admin/verify-login-password',
    ];
    const path = req.originalUrl;
    if (publicRoutes.includes(path)) {
        return next();
    }
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return ErrorHandler.unauthorized(req, res, 'Unauthorized access');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        return ErrorHandler.internalError(
            req,
            res,
            'JWT secret not configured'
        );
    }

    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return ErrorHandler.unauthorized(req, res, 'Invalid token');
        }

        (req as any).user = decoded;
        next();
    });
};
