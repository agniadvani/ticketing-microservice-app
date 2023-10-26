import { CustomError } from "./custom-error";

export class NotFoundError extends CustomError {
    statusCode = 404;

    constructor() {
        super("Resource not found")
    }

    serializeErrors() {
        return [{ message: "Not Found" }]
    }

}