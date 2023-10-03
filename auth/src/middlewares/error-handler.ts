import express from 'express'
import { CustomError } from '../errors/custom-error'

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send({ errors: err.serializeErrors() })
    }

    res.status(400).send({
        message: err.message
    })
}