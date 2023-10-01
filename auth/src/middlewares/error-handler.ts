import express from 'express'
import { RequestValidationError } from '../errors/request-validation-error'
import { DatabaseConnectionError } from '../errors/database-connection-error'

export const errorHandler = (err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log("Something Went Wrong:", err)

    if (err instanceof RequestValidationError) {
        const formattedError = err.errors.map(error => {
            if (error.type === "field") {
                return { message: error.msg, field: error.path }
            }
        })

        return res.status(400).send({ errors: formattedError })
    }

    if (err instanceof DatabaseConnectionError) {
        return res.status(500).send({
            errors: [
                { message: "could not connect to database" }
            ]
        })
    }

    res.status(400).send({
        message: err.message
    })
}