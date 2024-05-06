import express from 'express';
import { UserController } from '../controllers/user/UserController';

const router = express.Router();

const userController = new UserController();

router.post('/create-user', userController.registerUser.bind(userController));
router.put('/set-pin', userController.setUserPin.bind(userController));
router.post('/forgot-pin', userController.forgotPin.bind(userController));
router.put('/reset-pin', userController.resetPin.bind(userController))
router.post('/login-customer', userController.loginCustomer.bind(userController));
router.get('/users-list', userController.getUsersList.bind(userController));
router.get('/:identityId', userController.getUserData.bind(userController));
router.delete('/delete/:identityId', userController.deleteUser.bind(userController));
router.put('/edit/:identityId', userController.editUserData.bind(userController));

export default router;
