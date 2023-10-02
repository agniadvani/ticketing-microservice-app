export abstract class CustomError extends Error {
    abstract statusCode: number;
    abstract serializeErrors(): { errors: { message: string; field?: string }[] }

    constructor(message: string) {
        super(message)
    }
}