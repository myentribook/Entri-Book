const express = require('express')

const { createPurchase, getPurchase, getSinglePurchase, updatePurchase, deletePurchase } = require('../controllers/purchaseController')

const { isAuthenticatedUser } = require('../middlewares/authenticate')

const {isSubscribed} = require('../middlewares/isSubscribed')

const Router = express.Router()

Router.route('/purchase').get(isAuthenticatedUser, isSubscribed , getPurchase)

Router.route('/create/purchase').post(isAuthenticatedUser, isSubscribed ,  createPurchase)

Router.route('/purchase/:id').get(isAuthenticatedUser, isSubscribed, getSinglePurchase)

Router.route('/purchase/:id').put(isAuthenticatedUser, isSubscribed, updatePurchase)

Router.route('/purchase/:id').delete(isAuthenticatedUser, isSubscribed, deletePurchase)

module.exports = Router