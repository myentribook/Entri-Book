// // const catchAsyncError = require('../middlewares/catchAsyncError')
// // const ErrorHandler = require('../utils/ErrorHandler')
// // const JWT = require('jsonwebtoken')
// // const userModel = require('../models/userModel')

// // // exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {

// // //     console.log(req.cookies);

// // //     const { token } = req.cookies


// // //     if (!token) {

// // //         return next(
// // //             new ErrorHandler(
// // //                 'login first to access this resource',
// // //                 401
// // //             )
// // //         )

// // //     }

// // //     const decode = JWT.verify(token, process.env.JWT_SECRET)

// // //     console.log("Decoded:", decode);

// // //     req.user = await userModel.findById(decode.id)

// // //     console.log("User:", req.user);

// // //     next()

// // // })


// // exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
// //     const { token } = req.cookies;


// //     if (!token) {
// //         return next(new ErrorHandler('Login first to access this resource', 401));
// //     }

// //     // console.log(`Headers : ${req.headers.authorization}` )
// //     // Now 'jwt' will be defined and this will work
// //     const decoded = JWT.verify(token, process.env.JWT_SECRET);
// //     // console.log("Decoded ID from Token:", decoded.id); // Id varutha?

// //     req.user = await userModel.findById(decoded.id);
// //     // console.log("Found User:", req.user);

// //     next();
// // });



// // exports.AuthorizedRoles = (...roles) => {

// //     return (req, res, next) => {
// //         if (!roles.includes(req.user.role)) {
// //             return next(new ErrorHandler(`Role ${req.user.role} is not allowed !`))
// //         }
// //         next()
// //     }

// // }


// const catchAsyncError = require('../middlewares/catchAsyncError');
// const ErrorHandler = require('../utils/ErrorHandler');
// const JWT = require('jsonwebtoken');
// const userModel = require('../models/userModel');

// exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {

//     const token = req.cookies?.token;

//     if (!token) {
//         return next(
//             new ErrorHandler('Login first to access this resource', 401)
//         );
//     }

//     const decoded = JWT.verify(token, process.env.JWT_SECRET);

//     const user = await userModel.findById(decoded.id);

//     if (!user) {
//         return next(
//             new ErrorHandler('User not found. Please login again.', 401)
//         );
//     }

//     req.user = user;

//     next();
// });

// exports.AuthorizedRoles = (...roles) => {
//     return (req, res, next) => {

//         if (!req.user || !roles.includes(req.user.role)) {
//             return next(
//                 new ErrorHandler('You are not authorized to access this resource', 403)
//             );
//         }

//         next();
//     };
// };



const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const token = req.cookies?.token;

    console.log("AUTH CHECK: Cookie exists:", !!token);
    console.log("AUTH CHECK: JWT secret exists:", !!process.env.JWT_SECRET);

    if (!token) {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    let decoded;

    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log("AUTH CHECK: JWT verified successfully");
    } catch (error) {
        console.log("AUTH CHECK: JWT ERROR:", error.name, error.message);
        return next(new ErrorHandler(error.message, 401));
    }

    req.user = await userModel.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler('User not found', 401));
    }

    console.log("AUTH CHECK: User found:", req.user._id);

    next();
});

exports.AuthorizedRoles = (...roles) => {
    return (req, res, next) => {

        if (!req.user || !roles.includes(req.user.role)) {
            return next(
                new ErrorHandler('You are not authorized to access this resource', 403)
            );
        }

        next();
    };
};