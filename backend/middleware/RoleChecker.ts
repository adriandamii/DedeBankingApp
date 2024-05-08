import ErrorHandler from "./ErrorHandler";
import { NextFunction, Request, Response } from 'express';


export class RoleChecker {
   static isAdmin(req:Request, res:Response, next:NextFunction) {
      if ((req as any).user && (req as any).user.userRole === 'admin') {
         return next();
       } else {
         return ErrorHandler.unauthorized(req, res, "Access denied. Admin only.")
       }
   }

   static isCustomer(req:Request, res:Response, next:NextFunction) {
       if ((req as any).user && (req as any).user.userRole === 'customer') {
           return next();
       } else {
         return ErrorHandler.unauthorized(req, res, "Access denied. Customers only.")
       }
   }
   static isCustomerOrAdmin(req: Request, res: Response, next: NextFunction) {
      if ((req as any).user && ((req as any).user.userRole === 'admin' || (req as any).user.userRole === 'customer')) {
          return next();
      } else {
          return ErrorHandler.unauthorized(req, res, "Access denied. Restricted to specific roles.");
      }
  }
}
