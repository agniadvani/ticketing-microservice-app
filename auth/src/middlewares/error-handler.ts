import express from 'express'
import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'
import { CustomError } from '../errors/custom-error'

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (err instanceof CustomError) {
        return res.status(err.statusCode).send(err.serializeErrors())
    }

    res.status(400).send({
        message: err.message
    })
}