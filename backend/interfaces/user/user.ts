enum UserRole {
   Admin = "admin",
   Customer = "customer"
}

export interface User {
   userId?: number;
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
