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

    if (!items || items.length === 0) {
        return next(new ErrorHandler("No items provided for purchase", 400));
    }

    let grandTotal = 0;
    const purchaseItems = [];
    const bulkOps = [];

    for (const item of items) {
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
            return next(new ErrorHandler(`Invalid Product ID format`, 400));
        }

        const product = await productModel.findOne({ _id: item.product, user: req.user.id });
        if (!product) {
            return next(new ErrorHandler(`Product not found with ID: ${item.product}`, 404));
        }

        const qty = Number(item.quantity);
        const price = Number(item.purchasePrice);
        const cf = Number(item.conversionFactor || product.conversionFactor || 1);

        if (!qty || qty <= 0) return next(new ErrorHandler(`Invalid quantity for ${product.name}`, 400));
        if (!price || price <= 0) return next(new ErrorHandler(`Invalid price for ${product.name}`, 400));

        const totalAmount = qty * price;
        grandTotal += totalAmount;

        purchaseItems.push({
            product: product._id,
            quantity: qty,
            conversionFactor: cf,
            purchasePrice: price,
            totalAmount
        });

        // Bulk operations மல்டிபிள் ரிக்வெஸ்ட் மோதிக்கொள்ளாமல் இருக்க உதவும்
        bulkOps.push({
            updateOne: {
                filter: { _id: product._id, user: req.user.id },
                update: {
                    $inc: { stock: qty }, // பழைய ஸ்டாக்குடன் புதிய Qty கண்டிப்பாகக் கூடும்
                    $set: { conversionFactor: cf }
                }
            }
        });
    }

    // ஒரே நேரத்தில் ஸ்டாக் அப்டேட் செய்யும் bulkWrite
    if (bulkOps.length > 0) {
        await productModel.bulkWrite(bulkOps);
    }

    // CREATE PURCHASE RECORD
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
