import { body, param } from 'express-validator';
import dotenv from 'dotenv';
dotenv.config();

class Validator {
    static validateCreateAccount() {
        return [
            body('amount')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isLength({ max: 7 })
                .withMessage('Account must be 7 digits long')
                .isNumeric()
                .withMessage('Account number must contains only numbers'),
            body('userId')
                .trim()
                .notEmpty()
                .withMessage('User ID is required')
                .isNumeric()
                .withMessage('User ID must contains only numbers'),
        ];
    }
    static validateUserRegistration() {
        return [
            body('email')
                .isEmail()
                .withMessage('Invalid email address')
                .normalizeEmail(),
            body('lastName')
                .trim()
                .notEmpty()
                .withMessage('Last name is required')
                .isAlphanumeric()
                .withMessage('Last name must have only characters')
                .escape(),
            body('firstName')
                .trim()
                .notEmpty()
                .withMessage('First name is required')
                .isAlphanumeric()
                .withMessage('First name must have only characters')
                .escape(),
            body('identityId')
                .trim()
                .notEmpty()
                .withMessage('Identity ID is required')
                .isNumeric()
                .withMessage('Identity ID must be numeric')
                .escape(),
        ];
    }
    static validateAccountId() {
        return [
            param('accountId')
                .trim()
                .notEmpty()
                .withMessage('Identity ID is required')
                .isNumeric()
                .withMessage('Identity ID must be numeric')
                .escape(),
        ];
    }
    static validateUserForgotPassword() {
        return [
            body('email')
                .isEmail()
                .withMessage('Invalid email address')
                .normalizeEmail(),
        ];
    }
    static validateGetWithdrawal() {
        return [
            body('uniqueAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
        ];
    }
    static validateMakeDeposit() {
        return [
            body('uniqueAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
            body('cashFlowAmount')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isLength({ max: 7 })
                .withMessage('Account must be 7 digits long')
                .isNumeric()
                .withMessage('Account number must contains only numbers'),
            body('cashFlowType')
                .equals('deposit')
                .withMessage('Cash flow type must be deposit'),
        ];
    }
    static validateAdminGetAccounts() {
        return [
            param('userId')
                .isNumeric()
                .withMessage('Identity ID must be numeric'),
        ];
    }
    static validateAdminGetAccountDetails() {
        return [
            param('accountId')
                .isNumeric()
                .withMessage('Account ID must be numeric'),
        ];
    }
    static validateMakeWithdrawal() {
        return [
            // body('uniqueAccountNumber')
            //     .trim()
            //     .notEmpty()
            //     .withMessage('Account number is required')
            //     .isNumeric()
            //     .withMessage('Account number must contains only numbers')
            //     .isLength({ min: 16, max: 16 })
            //     .withMessage('Account must be 16 digits long')
            //     .escape(),
            body('cashFlowAmount')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isLength({ max: 7 })
                .withMessage('Account must be 7 digits long')
                .isNumeric()
                .withMessage('Account number must contains only numbers'),
            body('cashFlowType')
                .equals('withdrawal')
                .withMessage('Cash flow type must be withdrawal'),
        ];
    }
    static validateGetDeposits() {
        return [
            body('uniqueAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
        ];
    }
    static validateUserResetPin() {
        return [
            body('token').notEmpty().withMessage('Token is required'),
            body('pinNumber')
                .trim()
                .notEmpty()
                .withMessage('Pin number is required')
                .isNumeric()
                .withMessage('Pin number must contains only numbers')
                .isLength({ min: 6 })
                .withMessage('PIN must be at least 4 digits long')
                .escape(),
        ];
    }
    static validateUserId() {
        return [
            param('userId')
                .isNumeric()
                .withMessage('Identity ID must be numeric'),
        ];
    }
    static validateUserEdit() {
        return [
            body('email')
                .isEmail()
                .withMessage('Invalid email address')
                .normalizeEmail(),
            body('lastName')
                .trim()
                .notEmpty()
                .withMessage('Last name is required')
                .isAlphanumeric()
                .withMessage('Last name must have only characters')
                .escape(),
            body('firstName')
                .trim()
                .notEmpty()
                .withMessage('First name is required')
                .isAlphanumeric()
                .withMessage('First name must have only characters')
                .escape(),
        ];
    }
    static validateSenderAccountNumber() {
        return [
            body('senderAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16 })
                .withMessage('Account must be at least 16 digits long')
                .escape(),
        ];
    }
    static validateReceiverAccountNumber() {
        return [
            body('receiverAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16 })
                .withMessage('Account must be at least 16 digits long')
                .escape(),
        ];
    }
    static validatePinNumber() {
        return [
            body('identityId')
                .trim()
                .notEmpty()
                .withMessage('Identity ID is required')
                .isNumeric()
                .withMessage('Identity ID must be numeric')
                .escape(),
            body('pinNumber')
                .trim()
                .notEmpty()
                .withMessage('Pin number is required')
                .isNumeric()
                .withMessage('Pin number must contains only numbers')
                .isLength({ min: 6 })
                .withMessage('PIN must be at least 4 digits long')
                .escape(),
        ];
    }
    static validateUniqueAccountNumber() {
        return [
            body('uniqueAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
        ];
    }
    static validateMakeTransaction() {
        return [
            body('senderAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
            body('receiverAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
            body('transactionAmount')
                .trim()
                .notEmpty()
                .withMessage('Transaction amount is required')
                .isNumeric()
                .withMessage('Transaction amount must contains only numbers')
                .isLength({ min: 2, max: 7 })
                .withMessage('Account must be at least 2 digits long')
                .escape(),
        ];
    }
    static validateTransactionDetails() {
        return [
            param('transactionId')
                .isNumeric()
                .withMessage('Transaction ID must be numeric'),
            body('senderAccountNumber')
                .trim()
                .notEmpty()
                .withMessage('Account number is required')
                .isNumeric()
                .withMessage('Account number must contains only numbers')
                .isLength({ min: 16, max: 16 })
                .withMessage('Account must be 16 digits long')
                .escape(),
        ];
    }
}

export default Validator;
