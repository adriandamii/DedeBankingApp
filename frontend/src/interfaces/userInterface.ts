enum UserRole {
   Admin = "admin",
   Customer = "customer"
}

export interface User {
   userId: number;
   lastName: string;
   firstName: string;
   email: string;
   identityId: string;
   pinNumber: string;
   token: string;
   isActive: number;
   userRole: UserRole;
   loginPasswordExpiration: Date;
   loginPassword: string;
}

export interface AuthState {
   user: User | null;
   isLoggedIn: boolean;
   status: 'idle' | 'loading' | 'succeeded' | 'failed';
 }
 
 export interface AuthPayload {
   isLoggedIn: boolean;
   user?: User;
 }
