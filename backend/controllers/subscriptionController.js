// controllers/subscriptionController.js
const Subscription = require('../models/subscriptionModel');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');

// Added 'lifetime' back with its amount mapping
const PLAN = { 
    monthly: 24900, 
    quarterly: 66000, 
    lifetime: 99900 // Update this amount to whatever your lifetime plan costs
};

exports.createSubscriptionOrder = catchAsyncError(async (req, res, next) => {
    const { plan } = req.body;
    const planKey = plan ? plan.toLowerCase() : '';
    
    if (!PLAN[planKey]) {
        return next(new ErrorHandler('Invalid subscription plan selected', 400));
    }

    const amount = PLAN[planKey];
    
    const options = {
        amount, 
        currency: 'INR', 
        receipt: `receipt_${Date.now()}`,
        notes: { userId: req.user.id, plan: planKey } 
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ success: true, order });
});

exports.activateTrial = catchAsyncError(async (req, res, next) => {
    let sub = await Subscription.findOne({ user: req.user.id });
    if (sub && sub.hasUsedTrial) return next(new ErrorHandler('Trial already used', 400));

    const endDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Subscription.findOneAndUpdate(
        { user: req.user.id },
        { status: 'trial', endDate, hasUsedTrial: true },
        { upsert: true, new: true }
    );
    res.status(200).json({ success: true, message: "Trial activated" });
});

exports.verifyAndActivatePaid = catchAsyncError(async (req, res, next) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
    const planKey = plan ? plan.toLowerCase() : '';

    if (!planKey || !PLAN[planKey]) {
        return next(new ErrorHandler('Invalid plan provided', 400));
    }

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const secretKey = process.env.RAZORPAY_KEY_SECRET || process.env.TEST_KEY_SECRET;
    
    const expectedSign = crypto.createHmac("sha256", secretKey).update(sign.toString()).digest("hex");
    
    if (razorpay_signature !== expectedSign) {
        return next(new ErrorHandler("Invalid Signature", 400));
    }

    // Set validity based on the validated plan key
    let endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // default monthly
    if (planKey === 'quarterly') {
        endDate = new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
    } else if (planKey === 'lifetime') {
        endDate = null;
    }
    
    await Subscription.findOneAndUpdate(
        { user: req.user.id },
        { 
            status: planKey === 'lifetime' ? 'lifetime' : 'active', 
            endDate, 
            transactionId: razorpay_payment_id, 
            transactionDate: new Date() 
        },
        { upsert: true, new: true }
    );
    
    res.status(200).json({ success: true, message: `Subscription ${planKey} activated successfully!` });
});

exports.getMySubscription = catchAsyncError(async (req, res, next) => {
    const subscription = await Subscription.findOne({ user: req.user.id });
    
    if (!subscription) {
        return res.status(200).json({ success: true, subscription: null });
    }

    const isValid = subscription.status === 'active' || subscription.status === 'trial' || subscription.status === 'lifetime';
    const isNotExpired = subscription.endDate ? new Date(subscription.endDate) > new Date() : true;

    if (!isValid || !isNotExpired) {
        return res.status(200).json({ success: true, subscription: null });
    }

    res.status(200).json({
        success: true,
        subscription
    });
});