const Product = require('../models/productModel');
const User = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');

const escapeRegex = (str) => String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

exports.getDashboardData = catchAsyncError(async (req, res, next) => {
    const queryParams = req.query || {};

    const query = { stock: { $gt: 0 } };

    if (typeof queryParams.keyword === 'string' && queryParams.keyword.trim()) {
        query.name = { $regex: escapeRegex(queryParams.keyword.trim()), $options: 'i' };
    }

    
    const products = await Product.find(query)
        .populate({
            path: 'user',
            select: 'name city phone' 
        })
        .select('name stock user');

    res.status(200).json({
        success: true,
        count: products.length,
        products
    });
});