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

    // console.log("\n");
    // console.log("==================================================");
    // console.log("🟢 CREATE PURCHASE API STARTED");
    // console.log("==================================================");
    // console.log("Supplier Name:", supplierName);
    // console.log("Supplier Bill No:", supplierBillNo);
    // console.log("Number of Items:", items?.length);
    // console.log("Request Items:", JSON.stringify(items, null, 2));
    // console.log("==================================================");

    // --------------------------------------------------
    // VALIDATE ITEMS
    // --------------------------------------------------
    if (!items || items.length === 0) {
        console.log("❌ ERROR: No items provided");
        return next(
            new ErrorHandler("No items provided for purchase", 400)
        );
    }

    let grandTotal = 0;
    const purchaseItems = [];
    const bulkOps = [];

    // --------------------------------------------------
    // PROCESS EACH PURCHASE ITEM
    // --------------------------------------------------
    for (const item of items) {

        // console.log("\n");
        // console.log("--------------------------------------------------");
        // console.log("📦 PROCESSING PURCHASE ITEM");
        // console.log("--------------------------------------------------");
        // console.log("Product ID:", item.product);
        // console.log("Incoming Quantity:", item.quantity);
        // console.log("Incoming Purchase Price:", item.purchasePrice);
        // console.log("Incoming Conversion Factor:", item.conversionFactor);

        // --------------------------------------------------
        // CHECK PRODUCT ID
        // --------------------------------------------------
        if (!mongoose.Types.ObjectId.isValid(item.product)) {

            console.log("❌ INVALID PRODUCT ID:", item.product);

            return next(
                new ErrorHandler(`Invalid Product ID format`, 400)
            );
        }

        // --------------------------------------------------
        // FIND PRODUCT
        // --------------------------------------------------
        const product = await productModel.findOne({
            _id: item.product,
            user: req.user.id
        });

        if (!product) {

            // console.log("❌ PRODUCT NOT FOUND:", item.product);

            return next(
                new ErrorHandler(
                    `Product not found with ID: ${item.product}`,
                    404
                )
            );
        }

        // --------------------------------------------------
        // GET VALUES
        // --------------------------------------------------
        const qty = Number(item.quantity);
        const price = Number(item.purchasePrice);

        const cf = Number(
            item.conversionFactor ||
            product.conversionFactor ||
            1
        );

        // --------------------------------------------------
        // 🔥 STOCK DEBUG - BEFORE UPDATE
        // --------------------------------------------------
        // console.log("\n");
        // console.log("🔍 STOCK DEBUG - BEFORE UPDATE");
        // console.log("--------------------------------------------------");
        // console.log("Product Name:", product.name);
        // console.log("Product ID:", product._id.toString());
        // console.log("OLD STOCK:", product.stock);
        // console.log("PURCHASE QTY:", qty);
        // console.log("CONVERSION FACTOR:", cf);
        // console.log("PURCHASE PRICE:", price);

        const expectedStock = Number(product.stock) + qty;

        // console.log("EXPECTED NEW STOCK:", expectedStock);
        // console.log("--------------------------------------------------");

        // --------------------------------------------------
        // VALIDATE QUANTITY
        // --------------------------------------------------
        if (!qty || qty <= 0) {

            // console.log("❌ INVALID QUANTITY:", qty);

            return next(
                new ErrorHandler(
                    `Invalid quantity for ${product.name}`,
                    400
                )
            );
        }

        // --------------------------------------------------
        // VALIDATE PRICE
        // --------------------------------------------------
        if (!price || price <= 0) {

            // console.log("❌ INVALID PURCHASE PRICE:", price);

            return next(
                new ErrorHandler(
                    `Invalid price for ${product.name}`,
                    400
                )
            );
        }

        // --------------------------------------------------
        // CALCULATE TOTAL
        // --------------------------------------------------
        const totalAmount = qty * price;

        grandTotal += totalAmount;

        // console.log("TOTAL AMOUNT:", totalAmount);
        // console.log("CURRENT GRAND TOTAL:", grandTotal);

        // --------------------------------------------------
        // CREATE PURCHASE ITEM
        // --------------------------------------------------
        purchaseItems.push({
            product: product._id,
            quantity: qty,
            conversionFactor: cf,
            purchasePrice: price,
            totalAmount
        });

        // --------------------------------------------------
        // PREPARE STOCK UPDATE
        // --------------------------------------------------
        bulkOps.push({
            updateOne: {
                filter: {
                    _id: product._id,
                    user: req.user.id
                },
                update: {
                    // 🔥 THIS ADDS PURCHASE QTY TO EXISTING STOCK
                    $inc: {
                        stock: qty
                    },

                    $set: {
                        conversionFactor: cf
                    }
                }
            }
        });

        // console.log("\n");
        // console.log("🛠️ BULK OPERATION CREATED");
        // console.log("Product:", product.name);
        // console.log("Operation: stock += qty");
        // console.log("Old Stock:", product.stock);
        // console.log("Quantity Added:", qty);
        // console.log("Expected Stock After Update:", expectedStock);
        // console.log("--------------------------------------------------");
    }

    // --------------------------------------------------
    // BULK STOCK UPDATE
    // --------------------------------------------------
    // console.log("\n");
    // console.log("==================================================");
    // console.log("🚀 STARTING BULK STOCK UPDATE");
    // console.log("==================================================");
    // console.log("Total Bulk Operations:", bulkOps.length);

    if (bulkOps.length > 0) {

        const bulkResult = await productModel.bulkWrite(bulkOps);

        // console.log("\n");
        // console.log("✅ BULK WRITE COMPLETED");
        // console.log("--------------------------------------------------");
        // console.log("Matched Count:", bulkResult.matchedCount);
        // console.log("Modified Count:", bulkResult.modifiedCount);
        // console.log("--------------------------------------------------");

    } else {

        console.log("⚠️ NO BULK OPERATIONS FOUND");

    }

    // --------------------------------------------------
    // 🔥 VERIFY STOCK AFTER BULK WRITE
    // --------------------------------------------------
    // console.log("\n");
    // console.log("==================================================");
    // console.log("🔍 VERIFYING STOCK AFTER BULK WRITE");
    // console.log("==================================================");

    for (const item of items) {

        const verifyProduct = await productModel.findOne({
            _id: item.product,
            user: req.user.id
        });

        if (verifyProduct) {

            // console.log("\n");
            // console.log("📊 STOCK VERIFICATION");
            // console.log("--------------------------------------------------");
            // console.log("Product:", verifyProduct.name);
            // console.log("Product ID:", verifyProduct._id.toString());
            // console.log("CURRENT DATABASE STOCK:", verifyProduct.stock);
            // console.log("Purchase Quantity:", Number(item.quantity));
            // console.log("--------------------------------------------------");

        } else {

            console.log(
                "❌ Could not find product while verifying:",
                item.product
            );

        }
    }

    // --------------------------------------------------
    // CREATE PURCHASE RECORD
    // --------------------------------------------------
    // console.log("\n");
    // console.log("==================================================");
    // console.log("💾 CREATING PURCHASE RECORD");
    // console.log("==================================================");
    // console.log("Grand Total:", grandTotal);
    // console.log("Purchase Items:", JSON.stringify(purchaseItems, null, 2));

    const purchase = await purchaseModel.create({
        supplierName,
        supplierBillNo,
        items: purchaseItems,
        grandTotal,
        user: req.user.id
    });

    console.log("✅ PURCHASE RECORD CREATED");
    console.log("Purchase ID:", purchase._id.toString());

    // --------------------------------------------------
    // FINAL RESPONSE
    // --------------------------------------------------
    // console.log("\n");
    // console.log("==================================================");
    // console.log("🟢 CREATE PURCHASE API COMPLETED SUCCESSFULLY");
    // console.log("==================================================");
    // console.log("\n");

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
