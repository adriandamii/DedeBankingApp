import { Request, Response } from 'express';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import {
    ResetPinJwtPayload,
    TokenIdJwtPayload,
    UserIdJwtPayload,
} from '../../interfaces/token/token';
import { transporter } from '../../utils/mailerService';
import ErrorHandler from '../../middleware/ErrorHandler';

dotenv.config();

export class UserController {
    async getUserData(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const query = 'SELECT * FROM users WHERE userId = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [userId]);

            if (results.length > 0) {
                res.json(results[0]);
            } else {
                return ErrorHandler.notFound(req, res, 'User not found');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async getAccountsByUserId(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const requestingUser = (req as any).user;

        if (
            requestingUser.userRole !== 'admin' &&
            requestingUser.userId !== userId
        ) {
            return ErrorHandler.unauthorized(
                req,
                res,
                'Access denied: You do not have permission to view these accounts.'
            );
        }

        try {
            const query = 'SELECT * FROM accounts WHERE userId = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [userId]);

            if (results.length > 0) {
                res.json(results);
            } else {
                return ErrorHandler.notFound(
                    req,
                    res,
                    'No accounts found for this user.'
                );
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async getAccountDetails(req: Request, res: Response): Promise<void> {
        const { userRole, userId } = (req as any).user;

        try {
            const accountId = req.params.accountId;
            const accountQuery = 'SELECT * FROM accounts WHERE accountId = ?';
            const [accountResults] = await db.query<RowDataPacket[]>(
                accountQuery,
                [accountId]
            );

            if (accountResults.length > 0) {
                const account = accountResults[0];

                if (userRole !== 'admin' && userId !== account.userId) {
                    return ErrorHandler.unauthorized(
                        req,
                        res,
                        'Access denied: You are neither an admin nor the owner of this account'
                    );
                }

                res.json(account);
            } else {
                return ErrorHandler.notFound(req, res, 'Account not found');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async forgotPin(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        try {
            const secret_key = process.env.JWT_SECRET;
            const [rows] = await db.query<RowDataPacket[]>(
                'SELECT userId FROM users WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return ErrorHandler.notFound(req, res, 'User not found');
            }

            const user = rows[0];
            const token = jwt.sign(
                { userId: user.userId, action: 'reset-pin' },
                secret_key!,
                { expiresIn: '1h' }
            );

            const resetLink = `http://localhost:3000/reset-pin/${token}`;
            await transporter.sendMail({
                from: '"Dede Banking App" <adrian.damii@yahoo.com>',
                to: email,
                subject: 'Forgot PIN number',
                html: `<p>Please click on this <a href="${resetLink}">link</a> to reset your PIN.</p>`,
            });

            res.send({
                message: 'Check your email for the reset link.',
                token: token,
            });
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async resetPin(req: Request, res: Response): Promise<void> {
        const { pinNumber } = req.body;
        const { token } = req.params;
        const secret_key = process.env.JWT_SECRET;

        try {
            const decoded = jwt.verify(token, secret_key!) as ResetPinJwtPayload;

        if (decoded.action !== 'reset-pin') {
            return ErrorHandler.badRequest(req, res, 'Invalid token action.');
        }
            const saltRounds = 10;
            const hashedPin = await bcrypt.hash(pinNumber, saltRounds);
            await db.query('UPDATE users SET pinNumber = ? WHERE userId = ?', [
                hashedPin,
                decoded.userId,
            ]);

            res.send({ message: 'PIN successfully reset.' });
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                return ErrorHandler.unauthorized(req, res, 'Token has expired, please request a new reset link.');
            } else if (error instanceof jwt.JsonWebTokenError) {
                return ErrorHandler.unauthorized(req, res, 'Invalid token.');
            } else {
                return ErrorHandler.internalError(req, res, error);
            }
        }
    }
    async setUserPin(req: Request, res: Response): Promise<void> {
        try {
            const secret_key = process.env.JWT_SECRET;
            const { pinNumber } = req.body;
            const { token } = req.params as TokenIdJwtPayload;
            const decoded = jwt.verify(token, secret_key!) as UserIdJwtPayload;
            const userId = decoded.userId;
            const saltRounds = 10;
            const hashedPin = await bcrypt.hash(pinNumber, saltRounds);

            const updatePinQuery = `UPDATE users SET pinNumber = ? WHERE identityId = ?`;
            const pinUpdateResult = await db.query<RowDataPacket[]>(
                updatePinQuery,
                [hashedPin, userId]
            );

            if (pinUpdateResult.length > 0) {
                const updateActiveQuery = `UPDATE users SET isActive = 1 WHERE identityId = ?`;
                await db.query(updateActiveQuery, [userId]);
                res.json({
                    message: 'Pin number set successfully',
                });
            } else {
                return ErrorHandler.notFound(req, res, 'No user found');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async loginCustomer(req: Request, res: Response): Promise<void> {
        try {
            const secret_key = process.env.JWT_SECRET;
            const { email, pinNumber } = req.body;

            const userQuery =
                'SELECT pinNumber, isActive, userId, userRole FROM users WHERE email = ?';
            const [user] = await db.query<RowDataPacket[]>(userQuery, [email]);

            if (user.length === 0) {
                return ErrorHandler.notFound(req, res, 'User not found');
            }

            if (!user[0].isActive) {
                return ErrorHandler.forbidden(req, res, 'Account is inactive');
            }

            const pinValid = await bcrypt.compare(pinNumber, user[0].pinNumber);
            if (!pinValid) {
                return ErrorHandler.unauthorized(
                    req,
                    res,
                    'Invalid PIN number'
                );
            }
            const token = jwt.sign(
                {
                    userId: user[0].userId,
                    userRole: user[0].userRole,
                },
                process.env.JWT_SECRET || secret_key!,
                { expiresIn: '24h' }
            );
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.json({ message: 'Login successful!', token: token });
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
}
