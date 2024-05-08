import path from 'path';
import express, { NextFunction } from 'express';
import bodyParser from 'body-parser';
import db from './database/config/database';
import dotenv from 'dotenv';
import cors from 'cors';
import userRoutes from './routes/UserRoute';
import accountRoutes from './routes/AccountRoute';
import transactionRoutes from './routes/TransactionRoute';
import cashFlowsRoutes from './routes/CashFlowRoute';
import adminRoutes from './routes/AdminRoute';
import { authenticateToken } from './middleware/auth';

dotenv.config();
const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(
    cors({
        origin: ['http://localhost:3000'],
        methods: 'GET, POST, PUT, DELETE',
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


app.listen(PORT, () =>
    console.log(`Server Running on Port: http://localhost:${PORT}`)
);
