const mongoose = require('mongoose');
const productModel = require('../models/productModel'); // உங்கள் மாடல் பெயர் இதுதான்
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeature = require('../utils/apiFeature');
const User = require('../models/userModel');

// ======================= GET ALL PRODUCTS =======================
exports.getproducts = catchAsyncError(async (req, res, next) => {
    if (!req.user?.id) {
        return next(new ErrorHandler("Please login to view products", 401));
    }

    const apiFeatures = new APIFeature(
        productModel.find({ user: req.user.id }),
        req.query || {}
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

    const bodyData = req.body && typeof req.body === 'object' ? req.body : {};
    const productData = { ...bodyData, user: req.user.id };

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
    if (!req.user?.id) {
        return next(new ErrorHandler("Please login to access this product", 401));
    }

    if (!req.params?.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Product not found", 404));
    }

    const product = await productModel.findOne({ _id: req.params.id, user: req.user.id });

    if (!product) return next(new ErrorHandler("Product not found", 404));

    const rawStock = Number(product.stock);
    const safeStock = Number.isFinite(rawStock) ? Math.max(0, rawStock) : 0;

    const rawConversion = Number(product.conversionFactor);
    const conversionFactor = Number.isFinite(rawConversion) && rawConversion > 0 ? rawConversion : 50;

    let bags = Math.floor(safeStock);
    let looseKg = Number(((safeStock - bags) * conversionFactor).toFixed(2));

    if (looseKg >= conversionFactor) {
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
    if (!req.user?.id) {
        return next(new ErrorHandler("Please login to update a product", 401));
    }

    if (!req.params?.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Product not found!", 404));
    }

    const updateData = req.body && typeof req.body === 'object' ? req.body : {};

    const product = await productModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        updateData,
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
    if (!req.user?.id) {
        return next(new ErrorHandler("Please login to delete a product", 401));
    }

    if (!req.params?.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Product not found!", 404));
    }

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