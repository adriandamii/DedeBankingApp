import express from 'express';
import { AuthController } from '../controllers/authController';

const router = express.Router();

const authController = new AuthController();

router.get(
   '/auth-check',
   authController.authCheck.bind(authController)
);

export default router;
