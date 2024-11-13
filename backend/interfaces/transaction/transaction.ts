export interface Transaction {
   transactionId?: number;
   accountId: string;
   transactionAmount: number;
   senderAccountNumber:number;
   receiverAccountNumber: number;
   transactionToken?:string;
   commission: number;
}
