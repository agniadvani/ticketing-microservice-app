export class DatabaseConnectionError extends Error {
    reason = "could not connect to DB"
    constructor() {
        super()
    }
}