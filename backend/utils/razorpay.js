const Razorpay = require('razorpay');

const keyId = typeof process.env.RAZORPAY_KEY_ID === 'string'
    ? process.env.RAZORPAY_KEY_ID.trim()
    : '';
const keySecret = typeof process.env.RAZORPAY_KEY_SECRET === 'string'
    ? process.env.RAZORPAY_KEY_SECRET.trim()
    : '';

if (!keyId || !keySecret) {
    throw new Error('RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set in environment variables.');
}

const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret
});

module.exports = razorpay;