const Subscription = require('../models/subscriptionModel');
const ErrorHandler = require('../utils/ErrorHandler');

// exports.isSubscribed = async (req, res, next) => {
//     const sub = await Subscription.findOne({ user: req.user.id });
//     if (!sub || !sub.isValid()) {
//         return next(new ErrorHandler('Subscription required', 403));
//     }
//     next();
// };

exports.isSubscribed = async (req, res, next) => {

    const sub = await Subscription.findOne({ user: req.user.id });

    console.log("Subscription:", sub);

    if (!sub) {
        console.log("No subscription found");
        return next(new ErrorHandler("Subscription required", 403));
    }

    console.log("isValid:", sub.isValid());

    if (!sub.isValid()) {
        return next(new ErrorHandler("Subscription expired", 403));
    }

    next();
}