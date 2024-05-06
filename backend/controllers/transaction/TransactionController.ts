import { Request, Response } from 'express';
import { TransactionFactory } from '../../factories/TransactionFactory';
import { Transaction } from '../../interfaces/transaction/transaction';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export class TransactionController {
    async createTransaction(req: Request, res: Response): Promise<void> {
        const transaction: Transaction = TransactionFactory.createTransaction(
            req.body
        );

        if (
            !transaction.senderAccountNumber ||
            !transaction.receiverAccountNumber ||
            !transaction.transactionAmount
        ) {
            res.status(400).send({ message: 'Missing required fields' });
        }
        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [account] = await connection.query<RowDataPacket[]>(
                'SELECT accountId FROM accounts WHERE uniqueAccountNumber = ?',
                [transaction.senderAccountNumber]
            );

            if (account.length === 0) {
                await connection.rollback();
                res.status(404).send({ message: 'Sender account not found' });
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
                'INSERT INTO transactions (accountId, senderAccountNumber, receiverAccountNumber, transactionAmount) VALUES (?, ?, ?, ?)',
                [
                    senderAccountId,
                    transaction.senderAccountNumber,
                    transaction.receiverAccountNumber,
                    transaction.transactionAmount,
                ]
            );
            await connection.commit();
            res.send({ message: 'Transaction successful' });
        } catch (error) {
            await connection.rollback();
            console.error('Transaction Error:', error);

            // Type assertion
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';
            res.status(500).send({
                message: 'Transaction failed',
                error: errorMessage,
            });
        }
    }
}
