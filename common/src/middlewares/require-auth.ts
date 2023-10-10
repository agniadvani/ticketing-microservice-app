import express from 'express'
import { NotAuthorizedError } from '../errors/not-authorized-error'

export const requireAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!req.currentUser) {
        throw new NotAuthorizedError()
    }

    next()
}