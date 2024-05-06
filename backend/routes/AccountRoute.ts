import express from 'express';
import { AccountController } from '../controllers/account/AccountController';

const router = express.Router();

const accountController = new AccountController();

router.post('/create-account', accountController.createAccount.bind(accountController));

export default router;
