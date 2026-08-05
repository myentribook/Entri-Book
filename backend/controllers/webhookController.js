const catchAsyncError = require('../middlewares/catchAsyncError');
const Subscription = require('../models/subscriptionModel');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');

exports.razorpayWebhook = catchAsyncError(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // 1. Verify Razorpay Signature securely using the raw buffer (req.body)
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(req.body); 
    const digest = shasum.digest('hex');

    if (digest !== req.headers['x-razorpay-signature']) {
        return res.status(400).json({ status: 'Invalid signature' });
    }

    // 2. Parse the raw buffer into a JSON object after verification
    const event = JSON.parse(req.body.toString());

    if (event.event === 'payment.captured') {
        const payment = event.payload.payment.entity;
        
        // 3. Reliable Fetch: Get notes from the Razorpay Order 
        // (Ensures notes are securely pulled from Razorpay servers instead of relying solely on payload)
        let userId, plan;
        if (payment.order_id) {
            const order = await razorpay.orders.fetch(payment.order_id);
            userId = order.notes?.userId;
            plan = order.notes?.plan;
        } else {
            // Fallback to payment notes if order_id is missing
            userId = payment.notes?.userId;
            plan = payment.notes?.plan;
        }

        if (userId && ['monthly', 'lifetime'].includes(plan)) {
            
            // 4. Duplicate Webhook Protection (Idempotency check)
            const existingSub = await Subscription.findOne({ transactionId: payment.id });
            if (existingSub) {
                return res.status(200).json({ status: 'already processed' });
            }

            // 5. Amount & Currency Validation
            const expectedAmount = plan === 'lifetime' ? 99900 : 24900;
            if (payment.amount !== expectedAmount || payment.currency !== 'INR') {
                return res.status(400).json({ status: 'Invalid payment amount or currency' });
            }

            // 6. Update Database
            const endDate = plan === 'lifetime' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
            await Subscription.findOneAndUpdate(
                { user: userId },
                { 
                    status: plan === 'lifetime' ? 'lifetime' : 'active', 
                    endDate, 
                    transactionId: payment.id, 
                    transactionDate: new Date() 
                },
                { upsert: true, new: true }
            );
        }
    }

    return res.status(200).json({ status: 'ok' });
});