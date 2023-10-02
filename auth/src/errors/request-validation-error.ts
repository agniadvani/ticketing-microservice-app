import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends Error implements CustomError {
    statusCode = 400

    constructor(private errors: ValidationError[]) {
        super()
    }


    serializeError(): { errors: { message: string; field?: string }[] } {
        return {
            errors: this.errors.map(error => {
                if (error.type === "field") {
                    return { message: error.msg, field: error.path }
                }
                return { message: error.msg }

            })
        }
    }

}