import express from 'express';
import { AdminController } from '../controllers/admin/AdminController';
import { RoleChecker } from '../middleware/RoleChecker';
import ErrorHandler from '../middleware/ErrorHandler';
import Validator from '../middleware/Validator';

const router = express.Router();
const checkValidation = ErrorHandler.validationError;

const adminController = new AdminController();

router.post('/create-admin', adminController.createAdmin.bind(adminController));

router.post(
    '/send-login-password',
    adminController.sendLoginPassword.bind(adminController)
);

router.post(
    '/verify-login-password',
    adminController.verifyLoginPassword.bind(adminController)
);

router.post(
    '/create-user',
    Validator.validateUserRegistration(),
    checkValidation,
    //RoleChecker.isAdmin,
    adminController.registerUser.bind(adminController)
);

router.get(
    '/users-list',
    checkValidation,
    RoleChecker.isAdmin,
    adminController.getUsersList.bind(adminController)
);



router.delete(
    '/delete/:userId',
    Validator.validateUserId(),
    checkValidation,
    RoleChecker.isAdmin,
    adminController.deleteUser.bind(adminController)
);

router.delete('/account/:accountId'),
    Validator.validateAccountId(),
    checkValidation,
    RoleChecker.isAdmin,
    adminController.deleteAccount.bind(adminController);

router.put(
    '/user-edit/:userId',
    Validator.validateUserEdit(),
    Validator.validateUserId(),
    checkValidation,
    RoleChecker.isAdmin,
    adminController.editUserData.bind(adminController)
);

export default router;
