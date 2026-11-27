const ErrorHandler = require("../utils/ErrorHandler")

module.exports = (err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    const safeErr = err && typeof err === "object" ? err : new Error("Internal server Error");
    safeErr.statusCode = safeErr.statusCode || 500;

    const env = typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV.trim().toUpperCase() : "";

    if (env === "DEVELOPMENT") {
        res.status(safeErr.statusCode).json({
            success: false,
            message: safeErr.message,
            stack: safeErr.stack,
            error: safeErr
        })
        return;
    }

    if (env === "PRODUCTION") {

        let message = safeErr.message

        let error = new ErrorHandler(message, safeErr.statusCode)

        if (safeErr.name === "ValidationError") {

            message = safeErr.errors ? Object.values(safeErr.errors).map((value) => value.message) : safeErr.message

            error = new ErrorHandler(message, 400)

        }


        if (safeErr.name === "CastError") {

            message = `Resource not found ${safeErr.path} : ${safeErr.value}`

            error = new ErrorHandler(message, 400)

        }


        if (safeErr.code === 11000) {
            const keys = safeErr.keyValue ? Object.keys(safeErr.keyValue).join(", ") : "";
            const message = `Duplicate Key: ${keys} already exists`;

            error = new ErrorHandler(message, 400);
        }


        if (safeErr.name === "JSONWebTokenError") {
            
            message = `JSON Web Token is Invalid . Try again `

            error = new ErrorHandler(message , 400)
        }


        if (safeErr.name === "TokenExpiredError") {
            
            message = `JSON Web Token is Expired . Try again `

            error = new ErrorHandler(message , 400)

        }




        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal server Error"
        })
        return;

    }

    res.status(safeErr.statusCode).json({
        success: false,
        message: safeErr.message || "Internal server Error"
    });

}