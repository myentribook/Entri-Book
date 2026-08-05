const Product = require('../models/productModel');
const User = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');

exports.getDashboardData = catchAsyncError(async (req, res, next) => {
    // 1. Query: Fetch products with stock > 0
    const query = { stock: { $gt: 0 } };

    // 2. Add search functionality
    if (req.query.keyword) {
        query.name = { $regex: req.query.keyword, $options: 'i' };
    }

    // 3. Fetch products and populate owner info
    // Populate-la 'user' nu kudukkama, model-oda modelName-a use pannunga 
    // or exact field path-a kudunga. 
    // Since productModel-la ref: 'User' nu irukku, adhaiye use pannalam:
    
    const products = await Product.find(query)
        .populate({
            path: 'user', // Idhu unga productModel-la irukkura field name
            select: 'name city phone' // User model-la irundhu ethu venumo adhu
        })
        .select('name stock user');

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
});