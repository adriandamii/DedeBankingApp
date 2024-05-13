import path from 'path';
import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import db from './database/config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/UserRoute';
import accountRoutes from './routes/AccountRoute';
import transactionRoutes from './routes/TransactionRoute';
import cashFlowsRoutes from './routes/CashFlowRoute';
import adminRoutes from './routes/AdminRoute';
import authRoutes from './routes/AuthCheckRoute';
import cookieParser from 'cookie-parser';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

import { authenticateToken } from './middleware/auth';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cookieParser());
app.use(bodyParser.json());
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: 'GET, POST, PUT, DELETE',
        credentials: true,
    })
);
app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Content-Type, Authorization'
    );
    next();
});
app.use(authenticateToken)

app.use('/user', userRoutes);
app.use('/account', accountRoutes);
app.use('/transaction', transactionRoutes);
app.use('/cash-flows', cashFlowsRoutes);
app.use('/admin', adminRoutes);
// app.delete('/gigi/delete/account/:accountId', async (req: Request, res: Response) => {
//     const adminUserRole = (req as any).user.userRole;
//     const { accountId } = req.params;

//     if (adminUserRole !== 'admin') {
//         return res.status(403).json({
//             message: 'Access denied: Admins only'
//         });
//     }

//     const connection = await db.getConnection();
//     try {
//         await connection.beginTransaction();
//         await connection.query('DELETE FROM cashFlows WHERE uniqueAccountNumber = ?', [accountId]);
//         await connection.query('DELETE FROM transactions WHERE senderAccountNumber = ?', [accountId]);
//         const [deleteResult] = await connection.query('DELETE FROM accounts WHERE uniqueAccountNumber = ?', [accountId]);

//         if (deleteResult.affectedRows === 0) {
//             await connection.rollback();
//             res.status(404).send({ message: 'Account not found' });
//             return;
//         }

//         await connection.commit();
//         res.send({ message: 'Account and all related data successfully deleted' });
//     } catch (error) {
//         await connection.rollback();
//         res.status(500).send({ message: 'Internal server error', error: error });
//     } finally {
//         connection.release();
//     }
// });
app.use('/', authRoutes);



app.listen(PORT, () =>
    console.log(`Server Running on Port: http://localhost:${PORT}`)
);
