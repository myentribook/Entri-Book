const express = require('express');
const router = express.Router();
const { razorpayWebhook } = require('../controllers/webHookController');

router.post('/razorpay', express.raw({ type: 'application/json' }), razorpayWebhook);

module.exports = router;