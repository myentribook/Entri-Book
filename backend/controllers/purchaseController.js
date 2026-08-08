const mongoose = require("mongoose");
const purchaseModel = require('../models/purchaseModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeature = require('../utils/apiFeature');
const ErrorHandler = require('../utils/ErrorHandler');
const productModel = require('../models/productModel');

// GET ALL PURCHASES (Restricted to logged-in user)
exports.getPurchase = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeature(
        purchaseModel.find({ user: req.user.id }),
        req.query
    ).search(['supplierName', 'supplierBillNo']);

    const purchase = await apiFeatures.query;

    res.status(200).json({
        success: true,
        message: "purchase list get successfully",
        total: purchase.length,
        purchase
    });
});

exports.createPurchase = catchAsyncError(async (req, res, next) => {
    const { supplierName, supplierBillNo, items } = req.body;

    // Validation
    if (!items || items.length === 0) {
        return next(new ErrorHandler("No items provided for purchase", 400));
    }

    let grandTotal = 0;
    const purchaseItems = [];

    for (const item of items) {
        // Validate ID
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
            return next(new ErrorHandler(`Invalid Product ID format`, 400));
        }

        // Fetch product ensuring it belongs to the logged-in user
        const product = await productModel.findOne({ _id: item.product, user: req.user.id });
        if (!product) {
            return next(new ErrorHandler(`Product not found with ID: ${item.product}`, 404));
        }

        if (!item.quantity || item.quantity <= 0) return next(new ErrorHandler(`Invalid quantity for ${product.name}`, 400));
        if (!item.purchasePrice || item.purchasePrice <= 0) return next(new ErrorHandler(`Invalid price for ${product.name}`, 400));

        const totalAmount = item.quantity * item.purchasePrice;
        grandTotal += totalAmount;

        purchaseItems.push({
            product: product._id,
            quantity: item.quantity,
            conversionFactor: item.conversionFactor,
            purchasePrice: item.purchasePrice,
            totalAmount
        });

        // Direct document fetch and save method to guarantee stock addition
        product.stock = Number(product.stock || 0) + Number(item.quantity);
        product.conversionFactor = item.conversionFactor;
        await product.save();
    }

    // CREATE PURCHASE RECORD with logged-in user reference
    const purchase = await purchaseModel.create({
        supplierName,
        supplierBillNo,
        items: purchaseItems,
        grandTotal,
        user: req.user.id
    });

    res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        purchase
    });
});


// GET SINGLE PURCHASE (Restricted to logged-in user)
exports.getSinglePurchase = catchAsyncError(async (req, res, next) => {
    const purchase = await purchaseModel.findOne({ _id: req.params.id, user: req.user.id });
    if (!purchase) return next(new ErrorHandler("Purchase not found!", 404));
    res.status(200).json({ success: true, purchase });
});

// UPDATE PURCHASE (Restricted to logged-in user)
exports.updatePurchase = catchAsyncError(async (req, res, next) => {
    let purchase = await purchaseModel.findOne({ _id: req.params.id, user: req.user.id });
    if (!purchase) return next(new ErrorHandler("Purchase not found!", 404));

    purchase = await purchaseModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({ success: true, message: "update purchase successfully", purchase });
});

// DELETE PURCHASE (Restricted to logged-in user)
exports.deletePurchase = catchAsyncError(async (req, res, next) => {
    const purchase = await purchaseModel.findOne({ _id: req.params.id, user: req.user.id });
    if (!purchase) return next(new ErrorHandler("Purchase not found!", 404));

    await purchase.deleteOne();
    res.status(200).json({ success: true, message: "purchase deleted successfully" });
});
