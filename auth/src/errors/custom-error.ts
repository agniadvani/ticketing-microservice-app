export interface CustomError {
    statusCode: number;
    serializeError(): { errors: { message: string; field?: string }[] }
}