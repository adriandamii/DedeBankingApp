import express from 'express';

import { UserController } from '../controllers/user/UserController';
import { RoleChecker } from '../middleware/RoleChecker';
import Validator from '../middleware/Validator';
import ErrorHandler from '../middleware/ErrorHandler';

const router = express.Router();

const userController = new UserController();

const checkValidation = ErrorHandler.validationError;

router.put(
    '/set-pin',
    Validator.validatePinNumber(),
    checkValidation,
    userController.setUserPin.bind(userController)
);

router.post(
    '/login-customer',
    userController.loginCustomer.bind(userController)
);

router.post(
    '/forgot-pin',
    Validator.validateUserForgotPassword(),
    checkValidation,
    userController.forgotPin.bind(userController)
);

router.put(
    '/reset-pin',
    Validator.validateUserResetPin(),
    checkValidation,
    userController.resetPin.bind(userController)
);

router.get(
    '/:userId',
    Validator.validateUserId(),
    checkValidation,
    RoleChecker.isCustomerOrAdmin,
    userController.getUserData.bind(userController)
);

export default router;
