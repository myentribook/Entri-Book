// const catchAsyncError = require('../middlewares/catchAsyncError');
// const ErrorHandler = require('../utils/ErrorHandler');
// const userModel = require('../models/userModel');
// const sendToken = require('../utils/JWT');
// const sendEmail = require('../utils/email');
// const crypto = require('crypto');
// const cloudinary = require('cloudinary').v2;
// const streamifier = require('streamifier');


// // Cloudinary config
// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRET
// });

// // ================= REGISTER =================
// // exports.registerUser = catchAsyncError(async (req, res, next) => {
// //     const { name, email, password, avatar, city, phone } = req.body;

// //     const userExists = await userModel.findOne({ email });
// //     if (userExists) {
// //         return next(new ErrorHandler('User with this email already exists', 400));
// //     }

// //     const user = await userModel.create({ name, email, password, avatar, city, phone });

// //     res.status(201).json({
// //         success: true,
// //         message: "User registered successfully. Please login to continue.",
// //         user
// //     });
// // });


// // exports.registerUser = catchAsyncError(async (req, res, next) => {
// //     const { name, email, password, city, phone } = req.body;

// //     // Check if email exists
// //     const userExists = await userModel.findOne({ email });
// //     if (userExists) {
// //         return next(new ErrorHandler('User with this email already exists', 400));
// //     }

// //     let avatar

// //     // Avatar path-ah handle pannunga
// //     let avatarPath = "";
// //     if (req.file) {
// //         avatarPath = req.file.path; // Multer intha path-ah kudukkum
// //     }

// //     const user = await userModel.create({
// //         name,
// //         email,
// //         password,
// //         avatar: avatarPath,
// //         city,
// //         phone
// //     });

// //     res.status(201).json({
// //         success: true,
// //         message: "User registered successfully.",
// //         user
// //     });
// // });


// exports.registerUser = catchAsyncError(async (req, res, next) => {
//     const { name, email, password, city, phone, gstin } = req.body;


//     console.log("GSTIN FROM REQUEST:", gstin);

//     console.log(
//         "GSTIN EXISTS IN ACTIVE SCHEMA:",
//         !!userModel.schema.path("gstin")
//     );

//     // 1. Check if email already exists
//     const userExists = await userModel.findOne({ email });
//     if (userExists) {
//         return next(new ErrorHandler('User with this email already exists', 400));
//     }

//     let avatarUrl = "";

//     // 2. Cloudinary Upload Logic
//     if (req.file) {
//         try {
//             const result = await new Promise((resolve, reject) => {
//                 let stream = cloudinary.uploader.upload_stream(
//                     { folder: "KuppanAgro_Avatars" },
//                     (error, result) => {
//                         if (result) resolve(result);
//                         else reject(error);
//                     }
//                 );
//                 streamifier.createReadStream(req.file.buffer).pipe(stream);
//             });

//             // Now 'result' is safely available here
//             avatarUrl = cloudinary.url(result.public_id, {
//                 width: 500,
//                 height: 500,
//                 crop: 'fill',
//                 format: 'jpg'
//             });
//         } catch (error) {
//             return next(new ErrorHandler('Avatar upload failed', 500));
//         }
//     }

//     // 3. Database-la Save pandrom
//     const user = await userModel.create({
//         name,
//         email,
//         password,
//         avatar: avatarUrl, // URL string is saved to MongoDB
//         city,
//         phone,
//         gstin
//     });

//     // 4. Send Response
//     res.status(201).json({
//         success: true,
//         message: "User registered successfully.",
//         user
//     });
// });


// // ================= LOGIN =================
// exports.Login = catchAsyncError(async (req, res, next) => {
//     const { email, password } = req.body;

//     if (!email || !password) {
//         return next(new ErrorHandler('please enter email and password', 400));
//     }

//     const user = await userModel.findOne({ email }).select('+password');

//     if (!user || !(await user.isValidPassword(password))) {
//         return next(new ErrorHandler('invalid email or password', 401));
//     }

//     sendToken(user, 200, res);
// });

// exports.Logout = catchAsyncError(async (req, res, next) => {
//     res.cookie('token', null, {
//         expires: new Date(Date.now()),
//         httpOnly: true
//     }).status(200).json({
//         success: true,
//         message: "Logged Out"
//     });
// });

// // ================= PASSWORD MANAGEMENT =================
// // exports.forgotPassword = catchAsyncError(async (req, res, next) => {
// //     const user = await userModel.findOne({ email: req.body.email });
// //     if (!user) return next(new ErrorHandler('user not found with this EMAIL', 404));

// //     const resetToken = user.getResetToken();
// //     await user.save({ validateBeforeSave: false });

// //      let BASE_URL=process.env.FRONTEND_URL

// //     if (process.env.NODE_ENV === 'PRODUCTION') {
// //         BASE_URL=`${req.protocol}://${req.get('host')}`
// //     }

// //     const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;
// //     const message = `Your password reset token URL is as follow \n\n ${resetUrl} \n\n If you have not request this email then ignore it.`;

// //     try {
// //         await sendEmail({
// //             email: user.email,
// //             subject: 'Password Reset Request for Your Myentribook Account',
// //             message
// //         });
// //         res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
// //     } catch (error) {
// //         user.resetPasswordToken = undefined;
// //         user.resetPasswordTokenExpires = undefined;
// //         await user.save({ validateBeforeSave: false });
// //         return next(new ErrorHandler(error.message, 500));
// //     }
// // });

// exports.forgotPassword = catchAsyncError(async (req, res, next) => {
//     const user = await userModel.findOne({ email: req.body.email });
//     if (!user) return next(new ErrorHandler('user not found with this EMAIL', 404));

//     const resetToken = user.getResetToken();
//     await user.save({ validateBeforeSave: false });

//     let BASE_URL = process.env.FRONTEND_URL;

//     if (process.env.NODE_ENV === 'PRODUCTION') {
//         BASE_URL = `${req.protocol}://${req.get('host')}`;
//     }

//     const resetUrl = `${BASE_URL}/password/reset/${resetToken}`;

//     try {
//         await sendEmail({
//             email: user.email,
//             subject: 'Reset Your Password Securely',
//             message: resetUrl // Direct-aa link mattum anupprom
//         });
//         res.status(200).json({ success: true, message: `Email sent to ${user.email}` });
//     } catch (error) {
//         user.resetPasswordToken = undefined;
//         user.resetPasswordTokenExpires = undefined;
//         await user.save({ validateBeforeSave: false });
//         return next(new ErrorHandler(error.message, 500));
//     }
// });

// exports.resetPassword = catchAsyncError(async (req, res, next) => {
//     const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

//     const user = await userModel.findOne({
//         resetPasswordToken,
//         resetPasswordTokenExpires: { $gt: Date.now() }
//     });

//     if (!user) return next(new ErrorHandler('password reset token is invalid or expired', 404));

//     if (req.body.password !== req.body.confirmPassword) {
//         return next(new ErrorHandler('password does not match', 400));
//     }

//     user.password = req.body.password;
//     user.resetPasswordToken = undefined;
//     user.resetPasswordTokenExpires = undefined;
//     await user.save({ validateBeforeSave: false });

//     sendToken(user, 200, res);
// });

// // ================= PROFILE =================
// // exports.getUserProfile = catchAsyncError(async (req, res, next) => {
// //     const user = await userModel.findById(req.user.id);
// //     res.status(200).json({ success: true, message: "get user profile successfully.", user });
// // });


// exports.getUserProfile = catchAsyncError(async (req, res, next) => {
//     // req.user is already populated by your auth middleware
//     // console.log("Middleware-la irunthu vantha req.user:", req.user);
//     const user = req.user;

//     res.status(200).json({
//         success: true,
//         message: "Get user profile successfully.",
//         user
//     });
// });


// exports.changePassword = catchAsyncError(async (req, res, next) => {
//     // 1. Fetch user including password
//     const user = await userModel.findById(req.user.id).select('+password');

//     // 2. Destructure from req.body (ensure it matches the frontend key: oldPassword)
//     const { oldPassword, password } = req.body;

//     // 3. Validation: If the backend still receives undefined, 
//     // it means your middleware is not parsing the request body.
//     if (!oldPassword || !password) {
//         return next(new ErrorHandler('Please provide both old and new passwords', 400));
//     }

//     // 4. Verify old password
//     const isMatch = await user.isValidPassword(oldPassword);

//     if (!isMatch) {
//         return next(new ErrorHandler('Old password is incorrect', 401));
//     }

//     // 5. Update and save
//     user.password = password;
//     await user.save();

//     res.status(200).json({ success: true });
// });

// // exports.changePassword = catchAsyncError(async (req, res, next) => {
// //     const user = await userModel.findById(req.user.id).select('+password');
// //     if (!(await user.isValidPassword(req.body.oldpassword))) {
// //         return next(new ErrorHandler('old password is incorrect', 401));
// //     }
// //     user.password = req.body.password;
// //     await user.save();
// //     res.status(200).json({ success: true });
// // });

// // exports.updateProfile = catchAsyncError(async (req, res, next) => {
// //     // 1. Prepare base user data
// //     let newUserData = { 
// //         name: req.body.name, 
// //         email: req.body.email 
// //     };

// //     // 2. Handle Avatar upload if it exists
// //     if (req.file) {
// //         try {
// //             const result = await new Promise((resolve, reject) => {
// //                 let stream = cloudinary.uploader.upload_stream(
// //                     { folder: "KuppanAgro_Avatars" },
// //                     (error, result) => {
// //                         if (result) resolve(result);
// //                         else reject(error);
// //                     }
// //                 );
// //                 streamifier.createReadStream(req.file.buffer).pipe(stream);
// //             });

// //             // Generate the URL from the result
// //             const avatarUrl = cloudinary.url(result.public_id, {
// //                 width: 500,
// //                 height: 500,
// //                 crop: 'fill',
// //                 format: 'jpg'
// //             });

// //             // Add the avatar URL to the newUserData object
// //             newUserData.avatar = avatarUrl;

// //         } catch (error) {
// //             return next(new ErrorHandler('Avatar upload failed', 500));
// //         }
// //     }

// //     // 3. Update the user (using req.params.id as discussed previously)
// //     const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
// //         new: true, 
// //         runValidators: true
// //     });

// //     if (!user) {
// //         return next(new ErrorHandler("User not found", 404));
// //     }

// //     res.status(200).json({ 
// //         success: true, 
// //         message: "Update profile successfully!", 
// //         user 
// //     });
// // });

// exports.updateProfile = catchAsyncError(async (req, res, next) => {

//     console.log("UPDATE PROFILE REQ.BODY:", req.body);
//     console.log("GSTIN VALUE:", req.body.gstin);

//     // 1. Prepare base user data from body
//     let newUserData = {
//         name: req.body.name,
//         email: req.body.email,
//         gstin: req.body.gstin !== undefined ? req.body.gstin : ""
//     };

//     // 2. Handle Avatar upload if it exists
//     if (req.file) {
//         try {
//             const result = await new Promise((resolve, reject) => {
//                 let stream = cloudinary.uploader.upload_stream(
//                     { folder: "KuppanAgro_Avatars" },
//                     (error, result) => {
//                         if (result) resolve(result);
//                         else reject(error);
//                     }
//                 );
//                 streamifier.createReadStream(req.file.buffer).pipe(stream);
//             });

//             newUserData.avatar = cloudinary.url(result.public_id, {
//                 width: 500,
//                 height: 500,
//                 crop: 'fill',
//                 format: 'jpg'
//             });
//         } catch (error) {
//             return next(new ErrorHandler('Avatar upload failed', 500));
//         }
//     }

//     // 3. Update the user using the ID from the authenticated session
//     const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
//         returnDocument: 'after',
//         runValidators: true
//     });

//     if (!user) {
//         return next(new ErrorHandler("User not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         message: "Update profile successfully!",
//         user
//     });
// });

// // ================= ADMIN =================
// exports.getAllUsers = catchAsyncError(async (req, res, next) => {
//     const users = await userModel.find();
//     res.status(200).json({ success: true, message: 'get all users successfully', users });
// });

// exports.getSpecificUser = catchAsyncError(async (req, res, next) => {
//     const user = await userModel.findById(req.params.id);
//     if (!user) return next(new ErrorHandler(`user not found with this ID ${req.params.id}`, 404));
//     res.status(200).json({ success: true, message: "get specific user successfully", user });
// });

// exports.updateUser = catchAsyncError(async (req, res, next) => {
//     const newUserData = { name: req.body.name, email: req.body.email, role: req.body.role };
//     const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
//         new: true, runValidators: true
//     });
//     res.status(200).json({ success: true, message: "update user successfully", user });
// });

// exports.deleteUser = catchAsyncError(async (req, res, next) => {
//     const user = await userModel.findById(req.params.id);
//     if (!user) return next(new ErrorHandler(`user not found with this ID ${req.params.id}`, 404));
//     await user.deleteOne();
//     res.status(200).json({ success: true, message: "Delete User Successfully" });
// });


const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const userModel = require('../models/userModel');
const sendToken = require('../utils/JWT');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Helper: Upload buffer to Cloudinary and return cropped avatar URL
const uploadAvatarToCloudinary = async (fileBuffer) => {
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'KuppanAgro_Avatars',
                resource_type: 'image'
            },
            (error, uploadResult) => {
                if (error) return reject(error);
                if (!uploadResult) return reject(new Error('Empty Cloudinary response'));
                resolve(uploadResult);
            }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
    });

    return cloudinary.url(result.public_id, {
        width: 500,
        height: 500,
        crop: 'fill',
        gravity: 'face',
        format: 'jpg',
        secure: true
    });
};

// Helper: Validate MongoDB ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// ================= REGISTER =================
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password, city, phone, gstin } = req.body;

    if (!name || !email || !password) {
        return next(new ErrorHandler('Name, email, and password are required', 400));
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedGstin = typeof gstin === 'string' && gstin.trim()
        ? gstin.toUpperCase().trim()
        : undefined;

    const userExists = await userModel.findOne({ email: normalizedEmail }).lean();
    if (userExists) {
        return next(new ErrorHandler('User with this email already exists', 400));
    }

    let avatarUrl = '';
    if (req.file && req.file.buffer) {
        try {
            avatarUrl = await uploadAvatarToCloudinary(req.file.buffer);
        } catch (error) {
            return next(new ErrorHandler('Avatar upload failed', 500));
        }
    }

    const user = await userModel.create({
        name: name.trim(),
        email: normalizedEmail,
        password,
        avatar: avatarUrl,
        city: city ? city.trim() : undefined,
        phone: phone ? phone.trim() : undefined,
        gstin: normalizedGstin
    });

    // Exclude password if schema doesn't default to select: false
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({
        success: true,
        message: 'User registered successfully.',
        user: safeUser
    });
});

// ================= LOGIN =================
exports.Login = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail }).select('+password');

    if (!user || !(await user.isValidPassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 200, res);
});

// ================= LOGOUT =================
exports.Logout = catchAsyncError(async (req, res, next) => {
    res.cookie('token', '', {
        expires: new Date(0),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: process.env.NODE_ENV === 'production'
    }).status(200).json({
        success: true,
        message: 'Logged Out'
    });
});

// ================= PASSWORD MANAGEMENT =================
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    if (!req.body.email) {
        return next(new ErrorHandler('Please provide an email address', 400));
    }

    const normalizedEmail = req.body.email.toLowerCase().trim();
    const user = await userModel.findOne({ email: normalizedEmail });

    // Avoid leaking whether an email exists in production if desired,
    // or keep explicit 404 if your frontend expects it:
    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404));
    }

    const resetToken = user.getResetToken();
    await user.save({ validateBeforeSave: false });

    const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');
    const resetUrl = `${frontendUrl}/password/reset/${resetToken}`;

    const message = `You requested a password reset. Open this link to reset your password:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Password Reset Request',
            message,
            resetUrl
        });

        res.status(200).json({
            success: true,
            message: `Reset link sent to ${user.email}`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordTokenExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler('Failed to send reset email', 500));
    }
});

exports.resetPassword = catchAsyncError(async (req, res, next) => {
    const { password, confirmPassword } = req.body;

    if (!password || !confirmPassword) {
        return next(new ErrorHandler('Please enter password and confirm password', 400));
    }

    if (password !== confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400));
    }

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await userModel.findOne({
        resetPasswordToken,
        resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return next(new ErrorHandler('Password reset token is invalid or expired', 400));
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    sendToken(user, 200, res);
});

// ================= PROFILE =================
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.user.id);
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Get user profile successfully.',
        user
    });
});

exports.changePassword = catchAsyncError(async (req, res, next) => {
    const { oldPassword, password } = req.body;

    if (!oldPassword || !password) {
        return next(new ErrorHandler('Please provide both old and new passwords', 400));
    }

    if (oldPassword === password) {
        return next(new ErrorHandler('New password must be different from old password', 400));
    }

    const user = await userModel.findById(req.user.id).select('+password');
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    const isMatch = await user.isValidPassword(oldPassword);
    if (!isMatch) {
        return next(new ErrorHandler('Old password is incorrect', 401));
    }

    user.password = password;
    await user.save();

    res.status(200).json({
        success: true,
        message: 'Password updated successfully'
    });
});

exports.updateProfile = catchAsyncError(async (req, res, next) => {
    const { name, email, city, phone, gstin } = req.body;
    const newUserData = {};

    if (typeof name === 'string' && name.trim()) {
        newUserData.name = name.trim();
    }

    if (typeof email === 'string' && email.trim()) {
        const normalizedEmail = email.toLowerCase().trim();
        const emailTaken = await userModel.findOne({
            email: normalizedEmail,
            _id: { $ne: req.user.id }
        }).lean();

        if (emailTaken) {
            return next(new ErrorHandler('Email is already in use by another account', 400));
        }
        newUserData.email = normalizedEmail;
    }

    if (typeof city === 'string') {
        newUserData.city = city.trim();
    }

    if (typeof phone === 'string') {
        newUserData.phone = phone.trim();
    }

    if (gstin !== undefined) {
        newUserData.gstin = typeof gstin === 'string' && gstin.trim()
            ? gstin.toUpperCase().trim()
            : '';
    }

    if (req.file && req.file.buffer) {
        try {
            newUserData.avatar = await uploadAvatarToCloudinary(req.file.buffer);
        } catch (error) {
            return next(new ErrorHandler('Avatar upload failed', 500));
        }
    }

    const user = await userModel.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Update profile successfully!',
        user
    });
});

// ================= ADMIN =================
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await userModel.find().lean();
    res.status(200).json({
        success: true,
        message: 'Get all users successfully',
        users
    });
});

exports.getSpecificUser = catchAsyncError(async (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Get specific user successfully',
        user
    });
});

exports.updateUser = catchAsyncError(async (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    const { name, email, role } = req.body;
    const newUserData = {};

    if (typeof name === 'string' && name.trim()) newUserData.name = name.trim();
    if (typeof email === 'string' && email.trim()) newUserData.email = email.toLowerCase().trim();
    if (typeof role === 'string' && role.trim()) newUserData.role = role.trim();

    const user = await userModel.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    });

    if (!user) {
        return next(new ErrorHandler(`User not found with this ID ${req.params.id}`, 404));
    }

    res.status(200).json({
        success: true,
        message: 'Update user successfully',
        user
    });
});

exports.deleteUser = catchAsyncError(async (req, res, next) => {
    if (!isValidObjectId(req.params.id)) {
        return next(new ErrorHandler('Invalid user ID', 400));
    }

    if (req.user && req.user.id.toString() === req.params.id.toString()) {
        return next(new ErrorHandler('You cannot delete your own admin account', 400));
    }

    const user = await userModel.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this ID ${req.params.id}`, 404));
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: 'Delete User Successfully'
    });
});