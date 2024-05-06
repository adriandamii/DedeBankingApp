import { Request, Response } from 'express';
import { CashFlowFactory } from '../../factories/CashFlowFactory';
import { CashFlow } from '../../interfaces/cashFlow/cashFlow';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

export class CashFlowController {
    async withdrawalAction(req: Request, res: Response): Promise<void> {
        const cashFlow: CashFlow = CashFlowFactory.createWithdrawalAction(
            req.body
        );
        const connection = await db.getConnection();
        console.log('withdrawalAction');

        try {
            await connection.beginTransaction();
            // Verify the account exists and fetch current balance
            const [account] = await connection.query<RowDataPacket[]>(
                'SELECT amount FROM accounts WHERE uniqueAccountNumber = ?',
                [cashFlow.uniqueAccountNumber]
            );

            if (account.length === 0) {
                await connection.rollback();
                res.status(404).send({ message: 'Account not found' });
            }

            const currentBalance = account[0].amount;

            // Check if sufficient funds are available
            if (currentBalance < cashFlow.cashFlowAmount) {
                await connection.rollback();
                res.status(400).send({ message: 'Insufficient funds' });
                return;
            }

            // Perform the withdrawal
            await connection.query(
                'UPDATE accounts SET amount = amount - ? WHERE uniqueAccountNumber = ?',
                [cashFlow.cashFlowAmount, cashFlow.uniqueAccountNumber]
            );

            await connection.query(
                'INSERT INTO cashFlows (uniqueAccountNumber, cashFlowType, cashFlowAmount, cashFlowCreationDate) VALUES (?, ?, ?, NOW())',
                [
                    cashFlow.uniqueAccountNumber,
                    cashFlow.cashFlowType,
                    cashFlow.cashFlowAmount,
                ]
            );

            await connection.commit();
            res.send({ message: 'Withdrawal successful' });
        } catch (error) {
            console.error('Withdrawal Action Error:', error);

            // Type assertion
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';
            res.status(500).send({
                message: 'Withdrawal Action failed',
                error: errorMessage,
            });
        }
    }
    async depositAction(req: Request, res: Response): Promise<void> {
        const cashFlow: CashFlow = CashFlowFactory.createWithdrawalAction(
            req.body
        );
        const connection = await db.getConnection();
        console.log('depositFunction');
        try {
            await connection.beginTransaction();

            await connection.query(
                'UPDATE accounts SET amount = amount + ? WHERE uniqueAccountNumber = ?',
                [cashFlow.cashFlowAmount, cashFlow.uniqueAccountNumber]
            );

            await connection.query(
                'INSERT INTO cashFlows (uniqueAccountNumber, cashFlowType, cashFlowAmount, cashFlowCreationDate) VALUES (?, ?, ?, NOW())',
                [
                    cashFlow.uniqueAccountNumber,
                    cashFlow.cashFlowType,
                    cashFlow.cashFlowAmount,
                ]
            );

            await connection.commit();
            res.send({ message: 'Deposit successful' });
        } catch (error) {
            console.error('Deposit Action Error:', error);

            // Type assertion
            const errorMessage =
                error instanceof Error
                    ? error.message
                    : 'An unknown error occurred';
            res.status(500).send({
                message: 'Withdrawal Action failed',
                error: errorMessage,
            });
        }
    }
}
