import { Request, Response } from 'express';
import { UserFactory } from '../../factories/UserFactory';
import { User } from '../../interfaces/user/user';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { ResetPinJwtPayload } from '../../interfaces/token/token';
import { transporter } from '../../utils/mailerService';
import ErrorHandler from '../../middleware/ErrorHandler';

dotenv.config();

export class UserController {
    
    async getUserData(req: Request, res: Response): Promise<void> {
        try {
            const { identityId } = req.params;
            const query = 'SELECT * FROM users WHERE identityId = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [
                identityId,
            ]);

            if (results.length > 0) {
                res.json(results[0]);
            } else {
                return ErrorHandler.notFound(req, res, 'User not found');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
    
    async forgotPin(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        try {
            const secret_key = process.env.JWT_SECRET
            const [rows] = await db.query<RowDataPacket[]>(
                'SELECT userId FROM users WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                return ErrorHandler.notFound(req, res, 'User not found');
            }

            const user = rows[0];
            const token = jwt.sign(
                { identityId: user.identityId, action: 'reset-pin' },
                secret_key!,
                { expiresIn: '1h' }
            );

            const resetLink = `http://localhost/reset-pin/${token}`;
            await transporter.sendMail({
                from: '"Dede Banking App" <adrian.damii@yahoo.com>',
                to: email,
                subject: 'Forgot PIN number',
                text: `Hi ${user.lastName} ${user.firstName} Please click on the following link to verify your account: ${resetLink}`,
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
        const { token, pinNumber } = req.body;
        const secret_key = process.env.JWT_SECRET
        const decoded = jwt.verify(token, secret_key!) as ResetPinJwtPayload;
        if (!decoded || decoded.action !== 'reset-pin') {
            return ErrorHandler.badRequest(
                req,
                res,
                'Invalid or expired token'
            );
        }

        try {
            const saltRounds = 10;
            const hashedPin = await bcrypt.hash(pinNumber, saltRounds);
            await db.query('UPDATE users SET pinNumber = ? WHERE userId = ?', [
                hashedPin,
                decoded.userId,
            ]);

            res.send({ message: 'PIN successfully reset.' });
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
    async setUserPin(req: Request, res: Response): Promise<void> {
        try {
            const { pinNumber, identityId } = req.body;

            const saltRounds = 10;
            const hashedPin = await bcrypt.hash(pinNumber, saltRounds);

            const updatePinQuery = `UPDATE users SET pinNumber = ? WHERE identityId = ?`;
            const pinUpdateResult = await db.query<RowDataPacket[]>(
                updatePinQuery,
                [hashedPin, identityId]
            );

            if (pinUpdateResult.length > 0) {
                const updateActiveQuery = `UPDATE users SET isActive = 1 WHERE identityId = ?`;
                await db.query(updateActiveQuery, [identityId]);
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
                res.status(401).json({ message: 'Invalid PIN number.' });
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
                    email: email,
                },
                process.env.JWT_SECRET || secret_key!,
                { expiresIn: '24h' }
            );
            // res.cookie('token', token, {
            //     httpOnly: true,
            //     sameSite: 'strict',
            // });
            res.json({ message: 'Login successful!', token: token });
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
}
