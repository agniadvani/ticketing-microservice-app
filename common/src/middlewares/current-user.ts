import express from 'express';
import jwt from 'jsonwebtoken';

interface UserPayload {
    email: string;
    id: string;
}

declare global {
    namespace Express {
        interface Request {
            currentUser?: UserPayload
        }
    }
}

export const currentUser = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.session?.jwt) {
        return next()
    }
    try {
        const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as UserPayload
        req.currentUser = payload
        next()
    } catch (err) {
        return next()
    }
}