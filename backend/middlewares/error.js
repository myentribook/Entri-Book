const ErrorHandler = require("../utils/ErrorHandler")

module.exports = (err, req, res, next) => {

    err.statusCode = err.statusCode || 500

    if (process.env.NODE_ENV == 'DEVELOPMENT') {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            stack: err.stack,
            error: err
        })

    }

    if (process.env.NODE_ENV == 'PRODUCTION') {

        let message = err.message

        let error = new ErrorHandler(message, 400)

        if (err.name == 'ValidationError') {

            message = Object.values(err.errors).map((value) => value.message)

            error = new ErrorHandler(message, 400)

        }


        if (err.name == 'CastError') {

            message = `Resource not found ${err.path} : ${err.value}`

            error = new ErrorHandler(message, 400)

        }


        if (err.code === 11000) {
            const message = `Duplicate Key: ${Object.keys(err.keyValue).join(", ")} already exists`;

            error = new ErrorHandler(message, 400);
        }


        if (err.name == 'JSONWebTokenError') {
            
            message = `JSON Web Token is Invalid . Try again `

            error = new ErrorHandler(message , 400)
        }


        if (err.name == 'TokenExpiredError') {
            
            message = `JSON Web Token is Expired . Try again `

            error = new ErrorHandler(message , 400)

        }




        res.status(error.statusCode).json({
            success: false,
            message: error.message || "Internal server Error"
        })

    }

}