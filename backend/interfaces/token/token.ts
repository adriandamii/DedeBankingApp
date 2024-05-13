import { JwtPayload } from 'jsonwebtoken';


enum UserRole {
  Admin = "admin",
  Customer = "customer"
}
export interface UserIdJwtPayload extends JwtPayload {
  userId: number;
}
export interface TokenIdJwtPayload extends JwtPayload {
  token: string;
}
export interface ResetPinJwtPayload extends JwtPayload {
  userId: number;
  action: string;
}

