const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
    const token = req.cookies?.token;

    console.log("AUTH CHECK: Cookie exists:", !!token);
    console.log("AUTH CHECK: JWT secret exists:", !!process.env.JWT_SECRET);

    if (!token || typeof token !== 'string') {
        return next(new ErrorHandler('Login first to access this resource', 401));
    }

    if (!process.env.JWT_SECRET) {
        return next(new ErrorHandler('JWT secret is not configured', 500));
    }

    let decoded;

    try {
        decoded = JWT.verify(token, process.env.JWT_SECRET);
        console.log("AUTH CHECK: JWT verified successfully");
    } catch (error) {
        console.log("AUTH CHECK: JWT ERROR:", error.name, error.message);
        return next(new ErrorHandler(error.message, 401));
    }

    if (!decoded || !decoded.id) {
        return next(new ErrorHandler('Invalid token payload', 401));
    }

    req.user = await userModel.findById(decoded.id);

    if (!req.user) {
        return next(new ErrorHandler('User not found', 401));
    }

    console.log("AUTH CHECK: User found:", req.user._id);

    next();
});

exports.AuthorizedRoles = (...roles) => {
    const allowedRoles = roles.map((role) => String(role).trim().toLowerCase());

    return (req, res, next) => {
        const userRole = typeof req.user?.role === 'string' ? req.user.role.trim().toLowerCase() : '';

        if (!req.user || !allowedRoles.includes(userRole)) {
            return next(
                new ErrorHandler('You are not authorized to access this resource', 403)
            );
        }

        next();
    };
};