import { Account } from "../interfaces/account/account";

export class AccountFactory {
    public static createAccount(data: Account): Account {
        return data;  
    }
}