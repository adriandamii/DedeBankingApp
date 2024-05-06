import { CashFlow } from "../interfaces/cashFlow/cashFlow";

export class CashFlowFactory {
    public static createWithdrawalAction(data: CashFlow): CashFlow {
        return data;  
    }
}