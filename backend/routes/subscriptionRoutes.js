const express = require('express');
const router = express.Router();
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { createSubscriptionOrder, verifyAndActivatePaid, activateTrial , getMySubscription } = require('../controllers/subscriptionController');
// const { razorpayWebhook } = require('../controllers/webhookController');

router.post('/order', isAuthenticatedUser, createSubscriptionOrder);
router.post('/verify', isAuthenticatedUser, verifyAndActivatePaid);
router.post('/trial', isAuthenticatedUser, activateTrial);
router.get('/my-subscription' , isAuthenticatedUser , getMySubscription)
// router.post('/webhook/razorpay', razorpayWebhook);

module.exports = router;