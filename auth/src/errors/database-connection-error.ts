import { CustomError } from "./custom-error"

export class DatabaseConnectionError extends CustomError {
    statusCode = 500

    constructor() {
        super("could not connect to DB")
    }

    serializeErrors() {
        return {
            errors: [
                { message: "could not connect to DB" }
            ]
        }
    }


}