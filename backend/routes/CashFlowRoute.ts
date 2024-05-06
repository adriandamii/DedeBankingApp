import express from 'express';
import { CashFlowController } from '../controllers/cashFlow/CashFlowController';

const router = express.Router();

const cashFlowController = new CashFlowController();

router.put('/withdrawal', cashFlowController.withdrawalAction.bind(cashFlowController));
router.put('/deposit', cashFlowController.depositAction.bind(cashFlowController));

export default router;
