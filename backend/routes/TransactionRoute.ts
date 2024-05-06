import express from 'express';
import { TransactionController } from '../controllers/transaction/TransactionController';

const router = express.Router();

const transactionController = new TransactionController();

router.post('/make-transaction', transactionController.createTransaction.bind(transactionController));

export default router;
