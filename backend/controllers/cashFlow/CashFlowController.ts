import { Request, Response } from 'express';
import { CashFlowFactory } from '../../factories/CashFlowFactory';
import { CashFlow } from '../../interfaces/cashFlow/cashFlow';
import db from '../../database/config/database';
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
import ErrorHandler from '../../middleware/ErrorHandler';

dotenv.config();

export class CashFlowController {
    async getCashFLows(req: Request, res: Response): Promise<void> {
        const { uniqueAccountNumber } = req.body;
        const userId = (req as any).user.userId;

        try {
            const ownerQuery =
                'SELECT userId FROM accounts WHERE uniqueAccountNumber = ?';
            const [ownerResults] = await db.query<RowDataPacket[]>(ownerQuery, [
                uniqueAccountNumber,
            ]);

            if (ownerResults.length === 0) {
                return ErrorHandler.notFound(req, res, 'Account not found');
            }

            if (ownerResults[0].userId !== userId) {
                return ErrorHandler.unauthorized(req, res, 'Access denied');
            }

            const query =
                'SELECT * FROM cashFlows WHERE uniqueAccountNumber = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [
                uniqueAccountNumber,
            ]);

            if (results.length > 0) {
                res.json(results);
            } else {
                return ErrorHandler.notFound(req, res, 'Cash flow not found');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async getWithdrawals(req: Request, res: Response): Promise<void> {
        const { uniqueAccountNumber } = req.body;
        const userId = (req as any).user.userId;
        const cashFlowType = 'withdrawal';

        try {
            const ownershipQuery =
                'SELECT userId FROM accounts WHERE uniqueAccountNumber = ?';
            const [ownershipResults] = await db.query<RowDataPacket[]>(
                ownershipQuery,
                [uniqueAccountNumber]
            );

            if (ownershipResults.length === 0) {
                return ErrorHandler.notFound(req, res, 'Account not found');
            }

            if (ownershipResults[0].userId !== userId) {
                return ErrorHandler.unauthorized(
                    req,
                    res,
                    'Access denied'
                );
            }

            const query =
                'SELECT * FROM cashFlows WHERE uniqueAccountNumber = ? AND cashFlowType = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [
                uniqueAccountNumber,
                cashFlowType,
            ]);

            if (results.length > 0) {
                res.json(results);
            } else {
                return ErrorHandler.notFound(
                    req,
                    res,
                    'Withdrawals not found.'
                );
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async getDeposits(req: Request, res: Response): Promise<void> {
        const { uniqueAccountNumber } = req.body;
        const userId = (req as any).user.userId;

        const cashFlowType = 'deposit';
        try {
            const ownershipQuery =
                'SELECT userId FROM accounts WHERE uniqueAccountNumber = ?';
            const [ownershipResults] = await db.query<RowDataPacket[]>(
                ownershipQuery,
                [uniqueAccountNumber]
            );

            if (ownershipResults.length === 0) {
                return ErrorHandler.notFound(req, res, 'Account not found');
            }

            if (ownershipResults[0].userId !== userId) {
                return ErrorHandler.unauthorized(
                    req,
                    res,
                    'Access denied'
                );
            }

            const query =
                'select * from cashFlows where uniqueAccountNumber = ? and cashFlowType = ?';
            const [results] = await db.query<RowDataPacket[]>(query, [
                uniqueAccountNumber,
                cashFlowType,
            ]);
            if (results.length > 0) {
                res.json(results);
            } else {
                return ErrorHandler.notFound(req, res, 'Deposits not found.');
            }
        } catch (error) {
            return ErrorHandler.internalError(req, res, error);
        }
    }

    async withdrawalAction(req: Request, res: Response): Promise<void> {
        const { uniqueAccountNumber, cashFlowAmount, cashFlowType } = req.body;
        const userId = (req as any).user.userId;
        
        const connection = await db.getConnection();
    
        try {
            await connection.beginTransaction();
    
            const ownershipQuery = 'SELECT userId, amount FROM accounts WHERE uniqueAccountNumber = ?';
            const [ownershipResults] = await connection.query<RowDataPacket[]>(ownershipQuery, [uniqueAccountNumber]);
    
            if (ownershipResults.length === 0) {
                await connection.rollback();
                return ErrorHandler.notFound(req, res, 'Account not found');
            }
    
            if (ownershipResults[0].userId !== userId) {
                await connection.rollback();
                return ErrorHandler.unauthorized(req, res, "Access denied");
            }
    
            const currentBalance = ownershipResults[0].amount;
    
            if (Number(currentBalance) < Number(cashFlowAmount)) {
                console.log(typeof currentBalance, " < ", typeof cashFlowAmount )
                await connection.rollback();
                return ErrorHandler.badRequest(req, res, 'Insufficient funds');
            }
    
            await connection.query(
                'UPDATE accounts SET amount = amount - ? WHERE uniqueAccountNumber = ?',
                [cashFlowAmount, uniqueAccountNumber]
            );
    
            await connection.query(
                'INSERT INTO cashFlows (uniqueAccountNumber, cashFlowType, cashFlowAmount, cashFlowCreationDate) VALUES (?, ?, ?, NOW())',
                [uniqueAccountNumber, cashFlowType, cashFlowAmount]
            );
    
            await connection.commit();
            res.send({ message: 'Withdrawal successful' });
        } catch ( error) {
            await connection.rollback();
            return ErrorHandler.internalError(req, res, error);
        } finally {
            connection.release();
        }
    }
    
    async depositAction(req: Request, res: Response): Promise<void> {
        const { uniqueAccountNumber, cashFlowAmount, cashFlowType } = req.body;
        const userId = (req as any).user.userId;
    
        const connection = await db.getConnection();
    
        try {
            await connection.beginTransaction();
    
            const accountOwnerQuery = 'SELECT userId FROM accounts WHERE uniqueAccountNumber = ?';
            const [ownerResults] = await connection.query<RowDataPacket[]>(accountOwnerQuery, [uniqueAccountNumber]);
    
            if (ownerResults.length === 0) {
                await connection.rollback();
                return ErrorHandler.notFound(req, res, 'Account not found');
            }
    
            if (ownerResults[0].userId !== userId) {
                await connection.rollback();
                return ErrorHandler.unauthorized(req, res, "Access denied");
            }
    
            await connection.query(
                'UPDATE accounts SET amount = amount + ? WHERE uniqueAccountNumber = ?',
                [cashFlowAmount, uniqueAccountNumber]
            );
    
            await connection.query(
                'INSERT INTO cashFlows (uniqueAccountNumber, cashFlowType, cashFlowAmount, cashFlowCreationDate) VALUES (?, ?, ?, NOW())',
                [uniqueAccountNumber, cashFlowType, cashFlowAmount]
            );
    
            await connection.commit();
            res.send({ message: 'Deposit successful' });
        } catch (error) {
            await connection.rollback();
            return ErrorHandler.internalError(req, res, error);
        } finally {
            if (connection) connection.release();
        }
    }
    
}
