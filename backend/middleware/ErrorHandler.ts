import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
class ErrorHandler {
    static notFound(req: Request, res: Response, message = 'Not Found') {
        console.log(`NotFound Error at ${req.originalUrl}`);
        res.status(404).json({ message });
    }

    static unauthorized(req: Request, res: Response, message = 'Unauthorized') {
        res.status(401).json({ message });
    }

    static conflict(req: Request, res: Response, message = 'Conflict') {
        res.status(409).json({ message });
    }

    static badRequest(req: Request, res: Response, message = 'Bad Request') {
        res.status(400).json({ message });
    }

    static forbidden(req: Request, res: Response, message = 'Forbidden') {
        res.status(403).json({ message });
    }

    static internalError(req: Request, res: Response, error: unknown) {
        console.error('Internal Server Error:', error);

        let errorMessage = 'Unknown error';
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'string') {
            errorMessage = error;
        }

        res.status(500).json({
            message: 'Internal Server Error',
            error: errorMessage,
        });
    }

    static validationError(req: Request, res: Response, next: NextFunction) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const messages = errors.array().map(err => err.msg);
            return res.status(400).json({ errors: messages });        }
        next();
    }
}

export default ErrorHandler;
