import { Request, Response } from 'express';
import db from '../../database/config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import { User } from '../../interfaces/user/user';
import { UserFactory } from '../../factories/UserFactory';
import { loginTokenAdmin } from '../../utils/loginTokenAdmin';
import { transporter } from '../../utils/mailerService';
import ErrorHandler from '../../middleware/ErrorHandler';
import jwt from 'jsonwebtoken';

dotenv.config();

export class AdminController {
    async searchUserByIdentityId(req: Request, res: Response): Promise<void> {
        const { identityId } = req.query;
        if (!(req as any).user || (req as any).user.userRole !== 'admin') {
            return ErrorHandler.unauthorized(
                req,
                res,
                'Access denied: Admins only'
            );
        }

        if (!identityId) {
            return ErrorHandler.badRequest(
                req,
                res,
                'Identity ID is required for search'
            );
        }
        try {
            const query = 'SELECT * FROM users WHERE identityId = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [
                identityId,
            ]);

            if (results.length > 0) {
                res.json(results[0]);
            } else {
                res.status(404).json({
                    message: 'No users found with that identity ID',
                });
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async getUsersList(req: Request, res: Response): Promise<void> {
        const userRole = (req as any).user.userRole;
        if (userRole !== 'admin') {
            return ErrorHandler.unauthorized(req, res, 'Access denied');
        }

        const limit = parseInt(req.query.limit as string) || 10;
        const page = parseInt(req.query.page as string) || 1;
        const offset = (page - 1) * limit;

        try {
            const query =
                'SELECT * FROM users WHERE userRole = ? LIMIT ? OFFSET ?';
            const countQuery =
                'SELECT COUNT(*) AS count FROM users WHERE userRole = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [
                'customer',
                limit,
                offset,
            ]);
            const [totalResults] = await db.query<RowDataPacket[]>(countQuery, [
                'customer',
            ]);

            const total = totalResults[0].count;
            const totalPages = Math.ceil(total / limit);

            if (results.length > 0) {
                res.json({
                    data: results,
                    total,
                    totalPages,
                    page,
                    limit,
                });
            } else {
                return ErrorHandler.notFound(req, res, 'User not found');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async editUserData(req: Request, res: Response): Promise<void> {
        const userRole = (req as any).user.userRole;

        if (userRole !== 'admin') {
            return ErrorHandler.unauthorized(
                req,
                res,
                'Access denied: Admins only'
            );
        }

        try {
            const { userId } = req.params;
            const { firstName, lastName, email } = req.body;

            if (!firstName || !lastName || !email) {
                return ErrorHandler.badRequest(
                    req,
                    res,
                    'All fields are required'
                );
            }
            const emailQuery = `select email from users where email = ?`;
            const [results] = await db.query<RowDataPacket[]>(emailQuery, [
                email,
            ]);
            if (results.length > 0) {
                return ErrorHandler.conflict(req, res, 'Email already exists');
            }
            const query = `
                UPDATE users
                SET firstName = ?, lastName = ?, email = ?
                WHERE userId = ?`;

            await db.query<RowDataPacket[]>(query, [
                firstName,
                lastName,
                email,
                userId,
            ]);

            res.json({ message: 'User updated successfully.' });
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async registerUser(req: Request, res: Response): Promise<void> {
        const userRole = (req as any).user.userRole;

        if (userRole !== 'admin') {
            return ErrorHandler.unauthorized(
                req,
                res,
                'Access denied: Admins only'
            );
        }

        try {
            const secret_key = process.env.JWT_SECRET;
            const user: User = UserFactory.createUser({
                ...req.body,
                userRole: 'customer',
            });

            const emailQuery = `select email from users where email = ?`;
            const [results] = await db.query<RowDataPacket[]>(emailQuery, [
                user.email,
            ]);
            if (results.length > 0) {
                return ErrorHandler.conflict(req, res, 'Email already exists');
            }

            const query = `insert into users (email, lastName, firstName, identityId, userRole) values (?, ?, ?, ?, ?)`;
            const newUser = await db.query(query, [
                user.email,
                user.lastName,
                user.firstName,
                user.identityId,
                user.userRole,
            ]);
            const token = jwt.sign({ userId: user.identityId }, secret_key!, {
                expiresIn: '1h',
            });

            const verificationUrl = `http://localhost:3000/set-pin/${token}`;

            await transporter.sendMail({
                from: '"Dede Banking App" <adrian.damii@yahoo.com>',
                to: user.email,
                subject: 'Verify Your Account',
                text: `Hi ${user.lastName} ${user.firstName} Please click on the following link to verify your account: ${verificationUrl}`,
                html: `<p> ${user.lastName} ${user.firstName} Please click on the following link to verify your account: <a href="${verificationUrl}">Verify Account</a></p>`,
            });
            res.json({
                message: 'User registered successfully',
                data: newUser,
            });
        } catch (err) {
            return ErrorHandler.internalError(req, res, err);
        }
    }

    async createAdmin(req: Request, res: Response): Promise<void> {
        try {
            const user: User = UserFactory.createUser({
                ...req.body,
                userRole: 'admin',
                firstName: 'adminFirstName',
                lastName: 'adminLastName',
                email: process.env.ADMIN_EMAIL,
                identityId: process.env.ADMIN_IDENTITY_ID,
            });
            const emailQuery = `select email from users where email = ?`;
            const [results] = await db.query<RowDataPacket[]>(emailQuery, [
                user.email,
            ]);
            if (results.length > 0) {
                return ErrorHandler.conflict(req, res, 'Email already exists');
            }

            const query = `insert into users (email, lastName, firstName, identityId, userRole) values (?, ?, ?, ?, ?)`;
            const newUser = await db.query(query, [
                user.email,
                user.lastName,
                user.firstName,
                user.identityId,
                user.userRole,
            ]);

            res.json({
                message: 'User Admin registered successfully',
                data: newUser,
            });
        } catch (error: unknown) {
            ErrorHandler.internalError(req, res, error);
        }
    }
    async sendLoginPassword(req: Request, res: Response): Promise<void> {
        try {
            const adminEmail = process.env.ADMIN_EMAIL;
            const query = 'select * from users where email = ?';
            const [result] = await db.query<RowDataPacket[]>(query, [
                adminEmail,
            ]);

            if (result.length === 0) {
                return ErrorHandler.notFound(req, res, 'Admin not found');
            }

            const loginPassword = loginTokenAdmin();

            await db.query(
                'UPDATE users SET loginPassword = ?, loginPasswordExpiration = DATE_ADD(NOW(), INTERVAL 10 MINUTE) WHERE email = ?',
                [loginPassword, adminEmail]
            );

            await transporter.sendMail({
                from: '"Dede Banking App" <adrian.damii@yahoo.com>',
                to: adminEmail,
                subject: 'Admin login password',
                html: `<p> Hi, this is the login token ${loginPassword}"</p>`,
            });
            console.log(loginPassword);
            res.json({ message: 'Login Password sent' });
        } catch (error) {
            ErrorHandler.internalError(req, res, error);
        }
    }
    async verifyLoginPassword(req: Request, res: Response): Promise<void> {
        const { loginPassword } = req.body;
        const adminEmail = process.env.ADMIN_EMAIL;
        const secret_key = process.env.JWT_SECRET;

        try {
            const query =
                'SELECT * FROM users WHERE email = ? AND loginPassword = ? AND loginPasswordExpiration > NOW()';
            const [users] = await db.query<RowDataPacket[]>(query, [
                adminEmail,
                loginPassword,
            ]);
            if (users.length === 0) {
                return ErrorHandler.unauthorized(
                    req,
                    res,
                    'Invalid or expired login password.'
                );
            }

            const user = users[0];
            const userId = user.userId;
            const userRole = user.userRole;

            if (userRole !== 'admin') {
                return ErrorHandler.unauthorized(
                    req,
                    res,
                    'Access denied, not an admin.'
                );
            }

            await db.query(
                'UPDATE users SET loginPassword = NULL, loginPasswordExpiration = NULL WHERE email = ?',
                [adminEmail]
            );

            const token = jwt.sign(
                {
                    userId: userId,
                    userRole: userRole,
                    email: adminEmail,
                },
                secret_key!,
                { expiresIn: '24h' }
            );

            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
            });

            res.json({ message: 'Login successful.' });
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }
    async deleteUser(req: Request, res: Response): Promise<void> {
        const userId = req.params.userId;
        const adminUserRole = (req as any).user.userRole;

        if (adminUserRole !== 'admin') {
            return ErrorHandler.unauthorized(
                req,
                res,
                'Access denied: Admins only'
            );
        }

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            await connection.query(
                'DELETE cf FROM cashFlows cf JOIN accounts a ON cf.uniqueAccountNumber = a.uniqueAccountNumber WHERE a.userId = ?',
                [userId]
            );

            await connection.query(
                'DELETE tr FROM transactions tr JOIN accounts a ON tr.senderAccountNumber = a.uniqueAccountNumber WHERE a.userId = ?',
                [userId]
            );

            await connection.query('DELETE FROM accounts WHERE userId = ?', [
                userId,
            ]);

            await connection.query('DELETE FROM users WHERE userId = ?', [
                userId,
            ]);

            await connection.commit();
            res.send({
                message: 'User and all related data successfully deleted',
            });
        } catch (error) {
            await connection.rollback();
            return ErrorHandler.internalError(req, res, error);
        } finally {
            connection.release();
        }
    }
    // async deleteAccount(req: Request, res: Response): Promise<void> {
    //     const adminUserRole = (req as any).user.userRole;
    //     const { accountId } = req.params;
    //     res.json({message: "hei"})
    //     if (adminUserRole !== 'admin') {
    //         return ErrorHandler.unauthorized(
    //             req,
    //             res,
    //             'Access denied: Admins only'
    //         );
    //     }

    //     const connection = await db.getConnection();

    //     try {
    //         await connection.beginTransaction();

    //         await connection.query(
    //             'DELETE FROM cashFlows WHERE uniqueAccountNumber = ?',
    //             [accountId]
    //         );

    //         await connection.query(
    //             'DELETE FROM transactions WHERE senderAccountNumber = ?',
    //             [accountId, accountId]
    //         );

    //         const [deleteResult] = await connection.query<ResultSetHeader>(
    //             'DELETE FROM accounts WHERE uniqueAccountNumber = ?',
    //             [accountId]
    //         );

    //         if (deleteResult.affectedRows === 0) {
    //             await connection.rollback();
    //             return ErrorHandler.notFound(req, res, 'Account not found');
    //         }

    //         await connection.commit();
    //         res.send({
    //             message: 'Account and all related data successfully deleted',
    //         });
    //     } catch (error) {
    //         await connection.rollback();
    //         return ErrorHandler.internalError(req, res, error);
    //     } finally {
    //         connection.release();
    //     }
    // }
}
