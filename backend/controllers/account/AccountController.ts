import { Request, Response } from 'express';
import { AccountFactory } from '../../factories/AccountFactory';
import { Account } from '../../interfaces/account/account';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import { CustomJwtPayload } from '../../interfaces/token/token';
import { generateUniqueNumber } from '../../utils/uniqueNumberGenerator';
import ErrorHandler from '../../middleware/ErrorHandler';
dotenv.config();

export class AccountController {
    async getUserAccounts(req: Request, res: Response): Promise<void> {
        const userId = (req as any).user.userId;

        if (!userId) {
            return ErrorHandler.unauthorized(req, res, "Unauthorized")
        }

        try {
            const query = 'SELECT * FROM accounts WHERE userId = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [userId]);

            if (results.length > 0) {
                res.json(results);
            } else {
                return ErrorHandler.notFound(req, res, "No accounts found for this user")
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
    async createAccount(req: Request, res: Response): Promise<void> {
        try {
            const account: Account = AccountFactory.createAccount(req.body);

            const { userId } = req.params;

            const userQuery = `SELECT * FROM users WHERE userId = ?`;
            const [userResults] = await db.query<RowDataPacket[]>(userQuery, [
                userId,
            ]);
            if (userResults.length === 0) {
                return ErrorHandler.notFound(req, res, 'User not found');
            }

            const accountQuery = `INSERT INTO accounts (userId, amount, uniqueAccountNumber) VALUES (?, ?, ?)`;
            await db.query(accountQuery, [
                userId,
                account.amount,
                generateUniqueNumber(),
            ]);

            res.json({
                message: 'Account created successfully',
            });
        } catch (err) {
            return ErrorHandler.internalError(req, res, err);
        }
    }
}
