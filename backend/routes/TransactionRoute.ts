import express from 'express';
import { TransactionController } from '../controllers/transaction/TransactionController';
import { RoleChecker } from '../middleware/RoleChecker';
import ErrorHandler from '../middleware/ErrorHandler';
import Validator from '../middleware/Validator';

const router = express.Router();

const transactionController = new TransactionController();
const checkValidation = ErrorHandler.validationError;

router.post(
    '/make-transaction',
    Validator.validateMakeTransaction(),
    checkValidation,    
    RoleChecker.isCustomerOrAdmin,
    transactionController.createTransaction.bind(transactionController)
);

router.get(
    '/all-transactions',
    Validator.validateSenderAccountNumber(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    transactionController.getTransactionsList.bind(transactionController)
);

router.get(
    '/:transactionId',
    Validator.validateTransactionDetails(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    transactionController.getTransactionData.bind(transactionController)
);

export default router;
