const catchAsyncError = require('../middlewares/catchAsyncError');
const Subscription = require('../models/subscriptionModel');
const razorpay = require('../utils/razorpay');
const crypto = require('crypto');

exports.razorpayWebhook = catchAsyncError(async (req, res, next) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!secret) {
        return res.status(500).json({ status: 'Webhook secret not configured' });
    }

    const receivedSignature = req.headers['x-razorpay-signature'];
    if (!receivedSignature || typeof receivedSignature !== 'string') {
        return res.status(400).json({ status: 'Invalid signature' });
    }

    const rawBody = Buffer.isBuffer(req.body)
        ? req.body
        : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body || ''), 'utf8');

    // 1. Verify Razorpay Signature securely using the raw buffer (req.body)
    const shasum = crypto.createHmac('sha256', secret);
    shasum.update(rawBody); 
    const digest = shasum.digest('hex');

    const digestBuf = Buffer.from(digest, 'utf8');
    const sigBuf = Buffer.from(receivedSignature, 'utf8');
    const isValidSignature =
        digestBuf.length === sigBuf.length &&
        crypto.timingSafeEqual(digestBuf, sigBuf);

    if (!isValidSignature) {
        return res.status(400).json({ status: 'Invalid signature' });
    }

    // 2. Parse the raw buffer into a JSON object after verification
    let event;
    try {
        event = JSON.parse(rawBody.toString('utf8'));
    } catch (err) {
        return res.status(400).json({ status: 'Invalid JSON payload' });
    }

    if (event && event.event === 'payment.captured') {
        const payment = event.payload?.payment?.entity;
        if (!payment || !payment.id) {
            return res.status(200).json({ status: 'ok' });
        }
        
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

        const normalizedPlan = typeof plan === 'string' ? plan.trim().toLowerCase() : '';

        if (userId && ['monthly', 'quarterly', 'lifetime'].includes(normalizedPlan)) {
            
            // 4. Duplicate Webhook Protection (Idempotency check)
            const existingSub = await Subscription.findOne({ transactionId: payment.id });
            if (existingSub) {
                return res.status(200).json({ status: 'already processed' });
            }

            // 5. Amount & Currency Validation
            const expectedAmountMap = {
                monthly: 24900,
                quarterly: 66000,
                lifetime: 99900
            };
            const expectedAmount = expectedAmountMap[normalizedPlan];
            if (payment.amount !== expectedAmount || payment.currency !== 'INR') {
                return res.status(400).json({ status: 'Invalid payment amount or currency' });
            }

            // 6. Update Database
            const endDate = normalizedPlan === 'lifetime'
                ? null
                : normalizedPlan === 'quarterly'
                    ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
                    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
            
            await Subscription.findOneAndUpdate(
                { user: userId },
                { 
                    status: normalizedPlan === 'lifetime' ? 'lifetime' : 'active', 
                    endDate, 
                    transactionId: payment.id, 
                    transactionDate: new Date() 
                },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }
    }

    return res.status(200).json({ status: 'ok' });
});