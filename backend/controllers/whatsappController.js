// const Session = require("../models/sessionModel");
// const ErrorHandler = require("../utils/ErrorHandler");

// exports.whatsappWebhook = async (req, res, next) => {

//     const message =
//         req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

//     if (!message) {
//         return res.sendStatus(200);
//     }

//     const phoneNumber = message.from;

//     const text =
//         message.text?.body?.trim().toLowerCase();

//     if (text !== "send my bill") {
//         return res.sendStatus(200);
//     }

//     const alreadyExists = await Session.findOne({
//         mobileNumber: phoneNumber
//     });

//     if (alreadyExists) {
//         return next(
//             new ErrorHandler(
//                 "Customer already verified",
//                 400
//             )
//         );
//     }

//     await Session.create({
//         mobileNumber: phoneNumber,
//         lastMessageAt: new Date()
//     });

//     return res.status(200).json({
//         success: true,
//         message: "Customer verified successfully"
//     });
// };