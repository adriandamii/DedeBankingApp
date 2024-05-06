import { User } from "../interfaces/user/user";

export class UserFactory {
    public static createUser(data: User): User {
        return data;
    }
}
