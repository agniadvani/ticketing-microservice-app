import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode = 401

    constructor() {
        super("Unauthorized")
    }
    serializeErrors(): { message: string; field?: string | undefined; }[] {
        return [
            { message: "Unauthorized" }
        ]
    }
}