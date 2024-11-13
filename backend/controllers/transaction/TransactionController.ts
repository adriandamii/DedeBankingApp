import { Request, Response } from 'express';
import { TransactionFactory } from '../../factories/TransactionFactory';
import { Transaction } from '../../interfaces/transaction/transaction';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import ErrorHandler from '../../middleware/ErrorHandler';

dotenv.config();

export class TransactionController {
    async getTransactionsList(req: Request, res: Response): Promise<void> {
        const { senderAccountNumber } = req.params;
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.userRole;
        try {
            const accountQuery =
                'SELECT userId FROM accounts WHERE uniqueAccountNumber = ?';
            const [accountResults] = await db.query<RowDataPacket[]>(
                accountQuery,
                [senderAccountNumber]
            );
            if (accountResults[0].userId !== userId && userRole !== 'admin') {
                return ErrorHandler.unauthorized(req, res, 'Access denied');
            }
            const transactionQuery =
                'SELECT * FROM transactions WHERE senderAccountNumber = ? OR receiverAccountNumber = ?';
            const [transactionResults] = await db.query<RowDataPacket[]>(
                transactionQuery,
                [senderAccountNumber, senderAccountNumber]
            );
            if (transactionResults.length > 0) {
                res.json(transactionResults);
            } else {
                return ErrorHandler.conflict(
                    req,
                    res,
                    'Transactions not found.'
                );
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async getTransactionData(req: Request, res: Response): Promise<void> {
        const { transactionId } = req.params;
        const userId = (req as any).user.userId;

        try {
            const ownerQuery = `
                SELECT a.userId FROM accounts a
                JOIN transactions t ON a.uniqueAccountNumber = t.senderAccountNumber
                WHERE t.transactionId = ? AND a.userId = ?`;
            const [ownerResult] = await db.query<RowDataPacket[]>(ownerQuery, [
                transactionId,
                userId,
            ]);

            if (ownerResult.length === 0) {
                return ErrorHandler.unauthorized(req, res, 'Access denied');
            }

            const query = `
                SELECT transactionAmount, senderAccountNumber, receiverAccountNumber
                FROM transactions
                WHERE transactionId = ?`;
            const [transactionResult] = await db.query<RowDataPacket[]>(query, [
                transactionId,
            ]);

            if (transactionResult.length > 0) {
                res.json({ data: transactionResult[0] });
            } else {
                return ErrorHandler.notFound(
                    req,
                    res,
                    'Transaction data not found'
                );
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async createTransaction(req: Request, res: Response): Promise<void> {
        const transaction: Transaction = TransactionFactory.createTransaction(
            req.body
        );
        const userId = (req as any).user.userId;
        const userRole = (req as any).user.userRole;
        transaction.commission = 0;
        if (
            !transaction.senderAccountNumber ||
            !transaction.receiverAccountNumber ||
            !transaction.transactionAmount
        ) {
            return ErrorHandler.badRequest(req, res, 'Missing required fields');
        }
        if (
            transaction.senderAccountNumber === transaction.receiverAccountNumber
        ) {
            return ErrorHandler.unauthorized(
                req,
                res,
                'The accounts must be different'
            );
        }
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [account] = await connection.query<RowDataPacket[]>(
                'SELECT accountId, userId, amount FROM accounts WHERE uniqueAccountNumber = ?',
                [transaction.senderAccountNumber]
            );

            if (account.length === 0) {
                await connection.rollback();
                return ErrorHandler.notFound(
                    req,
                    res,
                    'Sender account not found'
                );
            }

            if (account[0].userId !== userId && userRole !== 'admin') {
                await connection.rollback();
                return ErrorHandler.unauthorized(
                    req,
                    res,
                    'Cannot perform transactions from an account that is not yours.'
                );
            }

            if (Number(account[0].amount) < Number(transaction.transactionAmount)) {
                return ErrorHandler.badRequest(req, res, "Insufficient amount for this transaction with 0 comission")
            }

            const [verifyExisting] = await db.query<RowDataPacket[]>('SELECT uniqueAccountNumber FROM accounts WHERE uniqueAccountNumber = ?', transaction.receiverAccountNumber)
            if (verifyExisting.length === 0) {
                transaction.commission = 10;
                if (Number(account[0].amount) < Number(transaction.transactionAmount) + transaction.commission) {
                    return ErrorHandler.badRequest(req, res, "Insufficient amount for this transaction with commission")
                }
                await db.query(
                    'UPDATE accounts SET amount = amount - ? WHERE uniqueAccountNumber = ?',
                    [transaction.commission, transaction.senderAccountNumber]
                );
            }

            const senderAccountId = account[0].accountId;
            await db.query(
                'UPDATE accounts SET amount = amount - ? WHERE uniqueAccountNumber = ?',
                [transaction.transactionAmount, transaction.senderAccountNumber]
            );
            
            await db.query(
                'UPDATE accounts SET amount = amount + ? WHERE uniqueAccountNumber = ?',
                [
                    transaction.transactionAmount,
                    transaction.receiverAccountNumber,
                ]
            );
            await connection.query(
                'INSERT INTO transactions (accountId, senderAccountNumber, receiverAccountNumber, transactionAmount, commission) VALUES (?, ?, ?, ?, ?)',
                [
                    senderAccountId,
                    transaction.senderAccountNumber,
                    transaction.receiverAccountNumber,
                    transaction.transactionAmount,
                    transaction.commission,
                ]
            );
            await connection.commit();
            if (verifyExisting.length === 0) {
                res.send({ message: 'Transaction successful with 10 comission' });
                return
            }
            res.send({ message: 'Transaction successful' });
        } catch (error) {
            await connection.rollback();
            return ErrorHandler.internalError(req, res, error);
        }
    }
}
