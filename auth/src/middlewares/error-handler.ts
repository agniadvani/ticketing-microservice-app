import express from 'express'
import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Something Went Wrong:", err)

    if (err instanceof RequestValidationError) {

        return res.status(err.statusCode).send(err.serializeError())
    }

    if (err instanceof DatabaseConnectionError) {
        return res.status(err.statusCode).send(err.serializeError())
    }

    res.status(400).send({
        message: err.message
    })
}