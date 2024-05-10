import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import ErrorHandler from '../middleware/ErrorHandler';

dotenv.config();

export class AuthController {
    async authCheck(req: Request, res: Response): Promise<void> {
        try {
            if (req.cookies.token) {
                try {
                    const payload = jwt.verify(
                        req.cookies.token,
                        process.env.JWT_SECRET!
                    );
                    res.json({ isLoggedIn: true, user: payload });
                } catch (error) {
                    res.json({ isLoggedIn: false });
                }
            } else {
                res.json({ isLoggedIn: false });
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
}
