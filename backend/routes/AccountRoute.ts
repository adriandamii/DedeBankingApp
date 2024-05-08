import express from 'express';
import { AccountController } from '../controllers/account/AccountController';
import { RoleChecker } from '../middleware/RoleChecker';
import ErrorHandler from '../middleware/ErrorHandler';
import Validator from '../middleware/Validator';

const router = express.Router();

const accountController = new AccountController();
const checkValidation = ErrorHandler.validationError;

router.post(
    '/create-account',
    Validator.validateCreateAccount(),
    checkValidation,
    RoleChecker.isAdmin,
    accountController.createAccount.bind(accountController)
);

router.get(
    '/get-user-accounts',
    RoleChecker.isCustomerOrAdmin,
    accountController.getUserAccounts.bind(accountController)
);

export default router;
