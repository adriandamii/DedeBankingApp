import { JwtPayload } from 'jsonwebtoken';

export interface CustomJwtPayload extends JwtPayload {
  identityId?: number;
}

export interface ResetPinJwtPayload extends JwtPayload {
  userId: number;
  action: string;
}