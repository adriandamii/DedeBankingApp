import { JwtPayload } from 'jsonwebtoken';


enum UserRole {
  Admin = "admin",
  Customer = "customer"
}
export interface CustomJwtPayload extends JwtPayload {
  userId?: number;
  userRole: UserRole;
  email: string;
}

export interface ResetPinJwtPayload extends JwtPayload {
  userId: number;
  action: string;
}

