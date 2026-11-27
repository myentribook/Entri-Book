const Subscription = require('../models/subscriptionModel');
const ErrorHandler = require('../utils/ErrorHandler');

exports.isSubscribed = async (req, res, next) => {
    try {
        if (!req.user || !req.user.id) {
            return next(new ErrorHandler("User not authenticated", 401));
        }

        const sub = await Subscription.findOne({ user: req.user.id });

        console.log("Subscription:", sub);

        if (!sub) {
            console.log("No subscription found");
            return next(new ErrorHandler("Subscription required", 403));
        }

        const isSubscriptionValid = typeof sub.isValid === 'function' ? sub.isValid() : false;

        console.log("isValid:", isSubscriptionValid);

        if (!isSubscriptionValid) {
            return next(new ErrorHandler("Subscription expired", 403));
        }

        next();
    } catch (error) {
        return next(error);
    }
}