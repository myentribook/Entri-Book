const express = require('express');
const {
    createBill,
    getBill,
    shareBillWhatsapp,
    getCreditBills,
    updateCreditBillPayment
} = require('../controllers/billController');

const { isAuthenticatedUser } = require('../middlewares/authenticate');
const Router = express.Router();

const { isSubscribed } = require('../middlewares/isSubscribed')

Router.route('/getBill').get(isAuthenticatedUser,isSubscribed, getBill);
Router.route('/createBill').post(isAuthenticatedUser, isSubscribed ,  createBill);
Router.route('/share-whatsapp/:billId').post(isAuthenticatedUser, isSubscribed , shareBillWhatsapp);
Router.route('/credit').get(isAuthenticatedUser, isSubscribed , getCreditBills);
Router.route('/bill/credit/:billId').put(isAuthenticatedUser, isSubscribed,  updateCreditBillPayment);

module.exports = Router;