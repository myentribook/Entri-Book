const express = require('express')

const { getproducts, newProduct, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/productController')

const { isAuthenticatedUser } = require('../middlewares/authenticate')

const { isSubscribed } = require('../middlewares/isSubscribed')

const router = express.Router()

router.route('/products').get(isAuthenticatedUser, isSubscribed, getproducts)

router.route('/product/new').post(isAuthenticatedUser, isSubscribed, newProduct)

router.route('/product/:id').get(isAuthenticatedUser, isSubscribed, getSingleProduct)

router.route('/product/:id').put(isAuthenticatedUser, isSubscribed, updateProduct)

router.route('/product/:id').delete(isAuthenticatedUser, isSubscribed, deleteProduct)


module.exports = router