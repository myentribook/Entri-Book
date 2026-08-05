const productModel = require('../models/productModel'); // உங்கள் மாடல் பெயர் இதுதான்
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeature = require('../utils/apiFeature');
const User = require('../models/userModel');

// ======================= GET ALL PRODUCTS =======================
exports.getproducts = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeature(
        productModel.find({ user: req.user.id }),
        req.query
    )
        .search(['name', 'category'])
        .category();

    const products = await apiFeatures.query;

    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        total: products.length,
        products
    });
});

// ======================= CREATE PRODUCT =======================
exports.newProduct = catchAsyncError(async (req, res, next) => {
    if (!req.user || !req.user.id) {
        return next(new ErrorHandler("Please login to create a product", 401));
    }

    const productData = { ...req.body, user: req.user.id };

    // திருத்தம்: 'Product' என்பதற்கு பதிலாக 'productModel' பயன்படுத்தப்பட்டுள்ளது
    const product = await productModel.create(productData);

    res.status(201).json({
        success: true,
        message: "New product created successfully",
        product
    });
});

// ======================= GET SINGLE PRODUCT =======================
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await productModel.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) return next(new ErrorHandler("Product not found", 404));

    let bags = Math.floor(product.stock);
    let looseKg = Number(((product.stock - bags) * product.conversionFactor).toFixed(2));

    if (looseKg >= product.conversionFactor) {
        bags += 1;
        looseKg = 0;
    }

    res.status(200).json({
        success: true,
        product,
        stockView: { bags, looseKg }
    });
});

// ======================= UPDATE PRODUCT =======================
exports.updateProduct = catchAsyncError(async (req, res, next) => {
    const product = await productModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true, runValidators: true }
    );

    if (!product) return next(new ErrorHandler("Product not found!", 404));

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    });
});

// ======================= DELETE PRODUCT =======================
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    const product = await productModel.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    });

    if (!product) return next(new ErrorHandler("Product not found!", 404));

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    });
});