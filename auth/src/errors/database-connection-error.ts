import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends Error implements CustomError {
    statusCode = 500

    constructor() {
        super()
    }

    serializeError(): { errors: { message: string; field?: string }[] } {
        return {
            errors: [
                { message: "could not connect to DB" }
            ]
        }
    }


}