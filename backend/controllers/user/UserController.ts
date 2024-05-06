import { Request, Response } from 'express';
import { UserFactory } from '../../factories/UserFactory';
import { User } from '../../interfaces/user/user';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { ResetPinJwtPayload } from '../../interfaces/token/token';

dotenv.config();

const SECRET_KEY = process.env.EMAIL_SECRET_KEY;

const transporter = nodemailer.createTransport({
    service: 'yahoo',
    secure: false,
    auth: {
        user: process.env.YAHOO_EMAIL,
        pass: process.env.YAHOO_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

export class UserController {
    async getUsersList(req: Request, res: Response): Promise<void> {
        try {
            const query = 'SELECT * FROM users';
            const [results] = await db.query<RowDataPacket[]>(query);

            if (results.length > 0) {
                res.json(results);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    }
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
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    }
    async editUserData(req: Request, res: Response): Promise<void> {
        try {
            const { identityId } = req.params;
            const { firstName, lastName, email } = req.body;

            // Ensure that required fields are provided
            if (!firstName || !lastName || !email) {
                res.status(400).json({
                    message:
                        'All fields are required: firstName, lastName, email',
                });
                return;
            }

            // Update the user in the database
            const query = `
                UPDATE users
                SET firstName = ?, lastName = ?, email = ?
                WHERE identityId = ?`;

            const results = await db.query<RowDataPacket[]>(query, [
                firstName,
                lastName,
                email,
                identityId,
            ]);

            // Check if the update was successful
            //if (results[0] === 0) {
            //res.status(404).json({ message: 'User not found or no new data to update.' });
            //return;
            //}

            res.json({ message: 'User updated successfully.' });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Error updating user', error });
        }
    }
    async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            const { identityId } = req.params;
            const query = 'DELETE FROM users WHERE identityId = ?';
            await db.query<RowDataPacket[]>(query, [identityId]);

            res.status(200).json({
                message: `the User with identityId: ${identityId} was deleted.`,
            });
        } catch (error) {
            console.error('Database error:', error);
            res.status(500).json({ message: 'Error fetching user' });
        }
    }
    async registerUser(req: Request, res: Response): Promise<void> {
        try {
            const user: User = UserFactory.createUser(req.body);

            //check if the email already exists
            const emailQuery = `select email from users where email = ?`;
            const [results] = await db.query<RowDataPacket[]>(emailQuery, [
                user.email,
            ]);
            if (results.length > 0) {
                res.status(404).json({ message: 'Email already exists.' });
                return;
            }
            const query = `insert into users (email, lastName, firstName, identityId) values (?, ?, ?, ?)`;
            const newUser = await db.query(query, [
                user.email,
                user.lastName,
                user.firstName,
                user.identityId,
            ]);

            // Generate JWT for email verification
            const emailToken = jwt.sign(
                { email: user.email, userId: user.identityId },
                'secret_key',
                {
                    expiresIn: '1h',
                }
            );
            const verificationUrl = `http://localhost:3000/set-pin`;

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
                token: emailToken,
            });
        } catch (err) {
            res.status(500).json({
                message: 'Error registering user',
                error: err,
            });
        }
    }
    async forgotPin(req: Request, res: Response): Promise<void> {
        const { email } = req.body;
        try {
            const [rows] = await db.query<RowDataPacket[]>(
                'SELECT userId FROM users WHERE email = ?',
                [email]
            );

            if (rows.length === 0) {
                res.status(404).send({ message: 'User not found' });
                return;
            }

            const user = rows[0];
            const token = jwt.sign(
                { userId: user.userId, action: 'reset-pin' },
                'secret_key',
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
            console.error('Error requesting PIN reset:', error);
            res.status(500).send({ message: 'Failed to process request.' });
        }
    }

    async resetPin(req: Request, res: Response): Promise<void> {
        const { token, pinNumber } = req.body;
        const decoded = jwt.verify(token, 'secret_key') as ResetPinJwtPayload;
        if (!decoded || decoded.action !== 'reset-pin') {
            res.status(400).send({ message: 'Invalid or expired token.' });
            return;
        }

        try {
            const saltRounds = 10;
            const hashedPin = await bcrypt.hash(pinNumber, saltRounds);
            await db.query(
                'UPDATE users SET pinNumber = ? WHERE userId = ?',
                [hashedPin, decoded.userId]
            );

            res.send({ message: 'PIN successfully reset.' });
        } catch (error) {
            console.error('Error resetting PIN:', error);
            res.status(500).send({ message: 'Failed to reset PIN.' });
        }
    }
    async setUserPin(req: Request, res: Response): Promise<void> {
        try {
            const { pinNumber, identityId } = req.body;

            const saltRounds = 10; // You can adjust this value based on security/performance requirements
            const hashedPin = await bcrypt.hash(pinNumber, saltRounds);
            // Update the pin number
            const updatePinQuery = `UPDATE users SET pinNumber = ? WHERE identityId = ?`;
            const pinUpdateResult = await db.query<RowDataPacket[]>(
                updatePinQuery,
                [hashedPin, identityId]
            );

            if (pinUpdateResult.length > 0) {
                const updateActiveQuery = `UPDATE users SET isActive = 1 WHERE identityId = ?`;
                await db.query(updateActiveQuery, [identityId]);
                res.json({
                    message: 'Pin number and active status set successfully',
                });
            } else {
                res.status(404).json({
                    message: 'No user found with the provided identity ID',
                });
            }
        } catch (error) {
            res.status(500).json({
                message: 'Failed to set pin number',
                error,
            });
        }
    }

    async loginCustomer(req: Request, res: Response): Promise<void> {
        try {
            const { email, pinNumber } = req.body;

            // Query the database to find the user by email
            const userQuery =
                'SELECT pinNumber, isActive, identityId FROM users WHERE email = ?';
            const [user] = await db.query<RowDataPacket[]>(userQuery, [email]);

            // Check if user was found
            if (user.length === 0) {
                res.status(404).json({ message: 'User not found.' });
                return;
            }

            // Verify if the user account is active
            if (!user[0].isActive) {
                res.status(403).json({ message: 'Account is inactive.' });
                return;
            }

            // Verify the pinNumber (assuming the pinNumbers are hashed)
            const pinValid = await bcrypt.compare(pinNumber, user[0].pinNumber);
            if (!pinValid) {
                res.status(401).json({ message: 'Invalid PIN number.' });
                return;
            }
            // Generate JWT token
            const token = jwt.sign(
                { email: email, userId: user[0].identityId },
                process.env.JWT_SECRET || 'your_secret_key', // Ensure you have a secure secret key
                { expiresIn: '1h' }
            );
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict',
            });
            res.json({ message: 'Login successful!', token: token });
        } catch (error: unknown) {
            console.error(error);

            let errorMessage = 'Unknown error';
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Return a more informative error message
            res.status(500).json({
                message: 'Error processing your login.',
                error: errorMessage,
            });
        }
    }
}
