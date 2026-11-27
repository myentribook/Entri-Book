const mongoose = require("mongoose");
const purchaseModel = require('../models/purchaseModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const APIFeature = require('../utils/apiFeature');
const ErrorHandler = require('../utils/ErrorHandler');
const productModel = require('../models/productModel');

const roundMoney = (val) => Math.round((Number(val) + Number.EPSILON) * 100) / 100;

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

    if (!Array.isArray(items) || items.length === 0) {
        console.log("❌ ERROR: No items provided");
        return next(
            new ErrorHandler("No items provided for purchase", 400)
        );
    }

    let grandTotal = 0;
    const purchaseItems = [];
    const bulkOps = [];

    for (const item of items) {
        if (!item || !mongoose.Types.ObjectId.isValid(item.product)) {
            console.log("❌ INVALID PRODUCT ID:", item && item.product);
            return next(
                new ErrorHandler(`Invalid Product ID format`, 400)
            );
        }

        const product = await productModel.findOne({
            _id: item.product,
            user: req.user.id
        });

        if (!product) {
            return next(
                new ErrorHandler(
                    `Product not found with ID: ${item.product}`,
                    404
                )
            );
        }

        const qty = Number(item.quantity);
        const price = Number(item.purchasePrice);

        const rawCf = Number(
            item.conversionFactor !== undefined && item.conversionFactor !== null && item.conversionFactor !== ""
                ? item.conversionFactor
                : (product.conversionFactor || 1)
        );
        const cf = Number.isFinite(rawCf) && rawCf > 0 ? rawCf : (product.conversionFactor || 1);

        const expectedStock = Number(product.stock || 0) + qty;

        if (!Number.isFinite(qty) || qty <= 0) {
            return next(
                new ErrorHandler(
                    `Invalid quantity for ${product.name}`,
                    400
                )
            );
        }

        if (!Number.isFinite(price) || price <= 0) {
            return next(
                new ErrorHandler(
                    `Invalid price for ${product.name}`,
                    400
                )
            );
        }

        const totalAmount = roundMoney(qty * price);
        grandTotal = roundMoney(grandTotal + totalAmount);

        purchaseItems.push({
            product: product._id,
            quantity: qty,
            conversionFactor: cf,
            purchasePrice: price,
            totalAmount
        });

        bulkOps.push({
            updateOne: {
                filter: {
                    _id: product._id,
                    user: req.user.id
                },
                update: {
                    $inc: {
                        stock: qty
                    },
                    $set: {
                        conversionFactor: cf
                    }
                }
            }
        });
    }

    if (bulkOps.length > 0) {
        const bulkResult = await productModel.bulkWrite(bulkOps);
    } else {
        console.log("⚠️ NO BULK OPERATIONS FOUND");
    }

    for (const item of items) {
        const verifyProduct = await productModel.findOne({
            _id: item.product,
            user: req.user.id
        });

        if (verifyProduct) {
            // Verified product exists for user
        } else {
            console.log(
                "❌ Could not find product while verifying:",
                item.product
            );
        }
    }

    const purchase = await purchaseModel.create({
        supplierName,
        supplierBillNo,
        items: purchaseItems,
        grandTotal,
        user: req.user.id
    });

    console.log("✅ PURCHASE RECORD CREATED");
    console.log("Purchase ID:", purchase._id.toString());

    res.status(201).json({
        success: true,
        message: "Purchase created successfully",
        purchase
    });
});

// GET SINGLE PURCHASE (Restricted to logged-in user)
exports.getSinglePurchase = catchAsyncError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Invalid Purchase ID format", 400));
    }

    const purchase = await purchaseModel.findOne({ _id: req.params.id, user: req.user.id });
    if (!purchase) return next(new ErrorHandler("Purchase not found!", 404));
    res.status(200).json({ success: true, purchase });
});

// UPDATE PURCHASE (Restricted to logged-in user)
exports.updatePurchase = catchAsyncError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Invalid Purchase ID format", 400));
    }

    let purchase = await purchaseModel.findOne({ _id: req.params.id, user: req.user.id });
    if (!purchase) return next(new ErrorHandler("Purchase not found!", 404));

    const updatePayload = {};
    if (req.body.supplierName !== undefined) updatePayload.supplierName = req.body.supplierName;
    if (req.body.supplierBillNo !== undefined) updatePayload.supplierBillNo = req.body.supplierBillNo;
    if (req.body.items !== undefined) updatePayload.items = req.body.items;
    if (req.body.grandTotal !== undefined) updatePayload.grandTotal = req.body.grandTotal;

    purchase = await purchaseModel.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        updatePayload,
        {
            new: true,
            runValidators: true
        }
    );

    res.status(200).json({ success: true, message: "update purchase successfully", purchase });
});

// DELETE PURCHASE (Restricted to logged-in user)
exports.deletePurchase = catchAsyncError(async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return next(new ErrorHandler("Invalid Purchase ID format", 400));
    }

    const purchase = await purchaseModel.findOne({ _id: req.params.id, user: req.user.id });
    if (!purchase) return next(new ErrorHandler("Purchase not found!", 404));

    await purchase.deleteOne();
    res.status(200).json({ success: true, message: "purchase deleted successfully" });
});