import { Request, Response } from 'express';
import { AccountFactory } from '../../factories/AccountFactory';
import { Account } from '../../interfaces/account/account';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { CustomJwtPayload } from '../../interfaces/token/token';
import bcrypt from 'bcryptjs';
import { generateUniqueNumber } from '../../utils/uniqueNumberGenerator';
dotenv.config();

export class AccountController {
    async createAccount(req: Request, res: Response): Promise<void> {
        try {
            const account: Account = AccountFactory.createAccount(req.body);

            const { userId } = req.body;

            // Check if the user exists
            const userQuery = `SELECT * FROM users WHERE userId = ?`;
            const [userResults] = await db.query<RowDataPacket[]>(userQuery, [
                userId,
            ]);
            if (userResults.length === 0) {
                res.status(404).json({ message: 'User not found.' });
                return;
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
            console.error('Database error:', err);
            res.status(500).json({
                message: 'Error creating account',
                error: err,
            });
        }
    }
}
