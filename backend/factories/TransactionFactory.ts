import { Transaction } from "../interfaces/transaction/transaction";

export class TransactionFactory {
    public static createTransaction(data: Transaction): Transaction {
        return data;
    }
}