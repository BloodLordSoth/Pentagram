export class AppError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "There seems to be something wrong on your end") {
        super(message, 401)
    }
}