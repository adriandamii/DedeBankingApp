enum CashFlowType {
   Withdrawal = "withdrawal",
   Deposit = "deposit"
}

export interface CashFlow {
   cashFlowId?: number;
   uniqueAccountNumber: number;
   cashFlowAmount:number;
   cashFlowType:CashFlowType;
}
