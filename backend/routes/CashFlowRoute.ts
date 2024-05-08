import express from 'express';
import { CashFlowController } from '../controllers/cashFlow/CashFlowController';
import { RoleChecker } from '../middleware/RoleChecker';
import ErrorHandler from '../middleware/ErrorHandler';
import Validator from '../middleware/Validator';

const router = express.Router();

const cashFlowController = new CashFlowController();
const checkValidation = ErrorHandler.validationError;

router.put(
    '/withdrawal',
    Validator.validateMakeWithdrawal(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    cashFlowController.withdrawalAction.bind(cashFlowController)
);

router.put(
    '/deposit',
    Validator.validateMakeDeposit(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    cashFlowController.depositAction.bind(cashFlowController)
);

router.get(
    '/all-cash-flows',
    Validator.validateUniqueAccountNumber(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    cashFlowController.getCashFLows.bind(cashFlowController)
);

router.get(
    '/all-withdrawals',
    Validator.validateGetWithdrawal(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    cashFlowController.getWithdrawals.bind(cashFlowController)
);

router.get(
    '/all-deposits',
    Validator.validateGetDeposits(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    cashFlowController.getDeposits.bind(cashFlowController)
);

export default router;
