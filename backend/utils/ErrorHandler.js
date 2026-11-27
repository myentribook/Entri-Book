class ErrorHandler extends Error {
    constructor(message, statusCode) {
        const normalizedMessage = typeof message === 'string' ? message : String(message ?? '');
        super(normalizedMessage);
        this.name = this.constructor.name;
        this.statusCode = typeof statusCode === 'number' && Number.isInteger(statusCode)
            ? statusCode
            : 500;
        this.isOperational = true;

        if (typeof Error.captureStackTrace === 'function') {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

module.exports = ErrorHandler;