const mongoose = require('mongoose');
const billModel = require('../models/billModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeature = require('../utils/apiFeature');
const axios = require('axios');

const roundTwo = (num) => Number(Number(num || 0).toFixed(2));
const roundFour = (num) => Number(Number(num || 0).toFixed(4));

exports.getBill = catchAsyncError(async (req, res, next) => {
    // Strictly filter by user AND force paymentType to be CASH
    let filter = {
        user: req.user.id,
        paymentType: { $regex: /^cash$/i }
    };

    const apiFeatures = new APIFeature(
        billModel.find(filter).populate('items.product'),
        req.query
    ).search(['customerName', 'invoiceNo']);

    const bills = await apiFeatures.query.sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        message: "Cash bills fetched successfully",
        total: bills.length,
        bills
    });
});

exports.createBill = catchAsyncError(async (req, res, next) => {
    const {
        customerName,
        customerMobile,
        items,
        paymentType = "CASH",
        cgstPercent = 0,
        sgstPercent = 0
    } = req.body || {};

    if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
    if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
    if (!Array.isArray(items) || !items.length) return next(new ErrorHandler("Please add at least one product", 400));

    // Mobile number cleaning & validation
    let cleanMobile = String(customerMobile || "").replace(/\D/g, '');
    if (cleanMobile.length === 11 && cleanMobile.startsWith('0')) {
        cleanMobile = cleanMobile.slice(1);
    }
    const mobileRegex = /^(91)?[6-9]\d{9}$/;

    if (!mobileRegex.test(cleanMobile)) {
        return next(new ErrorHandler("Invalid mobile number", 400));
    }

    const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

    let subTotal = 0;
    const billItems = [];
    const allowedSaleTypes = ["bag", "kg"];
    const stockRollbackList = [];

    try {
        for (const item of items) {
            const quantity = Number(item?.quantity);
            const price = Number(item?.price); // Per Bag or Per Kg price

            if (!Number.isFinite(quantity) || !Number.isFinite(price) || quantity <= 0 || price <= 0) {
                throw new ErrorHandler("Invalid quantity or price", 400);
            }

            const saleTypeLower = String(item?.saleType || "").toLowerCase();
            if (!allowedSaleTypes.includes(saleTypeLower)) throw new ErrorHandler("Invalid sale type", 400);

            if (!item?.product || !mongoose.Types.ObjectId.isValid(item.product)) {
                throw new ErrorHandler("Product not found", 404);
            }

            const product = await productModel.findOne({ _id: item.product, user: req.user.id });
            if (!product) throw new ErrorHandler("Product not found", 404);

            let stockToReduce = 0;
            let itemTotal = 0;
            // Fallback to 50 if conversionFactor is missing from product document
            const rawConversion = Number(product.conversionFactor);
            const conversion = Number.isFinite(rawConversion) && rawConversion > 0 ? rawConversion : 50;

            // 🔥 Perfect Stock and Price Calculation for Bag and Kg
            switch (saleTypeLower) {
                case "bag":
                    stockToReduce = quantity; // 1 bag = 1 unit of stock reduction (since stock is in bags)
                    itemTotal = quantity * price; // Per bag price
                    break;

                case "kg":
                    stockToReduce = conversion > 0 ? quantity / conversion : quantity; // Converts kg input to fractional bags
                    itemTotal = quantity * price; // Per Kg price
                    break;

                default:
                    stockToReduce = quantity;
                    itemTotal = quantity * price;
                    break;
            }

            const currentStock = Number(product.stock || 0);
            if (!Number.isFinite(currentStock) || currentStock < stockToReduce) {
                throw new ErrorHandler(`${product.name} has insufficient stock. Available: ${product.stock} bags, Required: ${stockToReduce} bags`, 400);
            }

            const previousStock = currentStock;
            product.stock = roundFour(currentStock - stockToReduce);
            await product.save();
            stockRollbackList.push({ product, previousStock });

            subTotal += itemTotal;

            // 🔥 Robust HSN Code extraction from Product model variations
            const extractedHsn = product.hsnCode || product.HSNCode || product.hsn || "";

            billItems.push({
                product: product._id,
                saleType: item.saleType,
                quantity,
                price,
                hsnCode: extractedHsn,
                total: roundTwo(itemTotal)
            });
        }
    } catch (err) {
        // Restore stock for earlier items if a later item in the same bill fails
        for (const entry of stockRollbackList.reverse()) {
            try {
                entry.product.stock = entry.previousStock;
                await entry.product.save();
            } catch (_) {
                // Preserve original error
            }
        }
        throw err;
    }

    subTotal = roundTwo(subTotal);

    // 🔥 Explicit safe float parsing for tax rates
    const rawCgst = parseFloat(cgstPercent);
    const rawSgst = parseFloat(sgstPercent);
    const parsedCgstRate = Number.isFinite(rawCgst) && rawCgst >= 0 ? rawCgst : 0;
    const parsedSgstRate = Number.isFinite(rawSgst) && rawSgst >= 0 ? rawSgst : 0;

    const cgst = roundTwo(subTotal * (parsedCgstRate / 100));
    const sgst = roundTwo(subTotal * (parsedSgstRate / 100));
    const totalTax = roundTwo(cgst + sgst);
    const grandTotal = roundTwo(subTotal + totalTax);

    const finalPaidAmount = paymentType === "CASH" ? grandTotal : 0;
    const balanceAmount = roundTwo(grandTotal - finalPaidAmount);

    // 🔥 Robust GSTIN extraction from User model variations
    const currentUser = await userModel.findById(req.user.id);
    const gstin = currentUser?.gstin || currentUser?.GSTIN || currentUser?.gstNumber || "";

    // 🕒 EXACT TIMESTAMP FORMAT: INV-YYMMDD-HHMMSS-MS (e.g., INV-261118-133245-842)
    const now = new Date();
    const yy = String(now.getFullYear()).slice(-2);
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');

    const invoiceNo = `INV-${yy}${mm}${dd}-${hh}${min}${ss}-${ms}`;

    const bill = await billModel.create({
        invoiceNo,
        gstin,
        customerName: customerName.trim(),
        customerMobile: formattedMobile,
        items: billItems,
        subTotal,
        cgst,
        sgst,
        totalTax,
        grandTotal,
        paymentType,
        paidAmount: finalPaidAmount,
        balanceAmount,
        status: balanceAmount <= 0 ? "PAID" : (finalPaidAmount > 0 ? "PARTIAL" : "PENDING"),
        user: req.user.id,
        paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
    });

    res.status(201).json({
        success: true,
        message: "Invoice created successfully",
        bill
    });
});

// ===================== GET CREDIT BILLS =====================
exports.getCreditBills = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeature(
        billModel.find({ user: req.user.id, paymentType: "CREDIT" }).populate('items.product'),
        req.query
    ).search(['customerName', 'invoiceNo']);

    const creditBills = await apiFeatures.query.sort({ balanceAmount: -1, createdAt: -1 });

    res.status(200).json({ success: true, count: creditBills.length, creditBills });
});

// ===================== UPDATE CREDIT BILL PAYMENT =====================
exports.updateCreditBills = catchAsyncError(async (req, res, next) => {
    const { id, billId } = req.params || {};
    const targetId = billId || id;
    const payment = Number(req.body?.paidAmount);

    if (!Number.isFinite(payment) || payment <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
    }

    if (!targetId || !mongoose.Types.ObjectId.isValid(targetId)) {
        return next(new ErrorHandler("Credit bill not found", 404));
    }

    const bill = await billModel.findOne({ _id: targetId, user: req.user.id });
    if (!bill || bill.paymentType !== "CREDIT") {
        return next(new ErrorHandler("Credit bill not found", 404));
    }

    const currentBalance = roundTwo(bill.balanceAmount);
    if (payment > currentBalance + 0.001) {
        return next(new ErrorHandler("Payment exceeds balance", 400));
    }

    const appliedPayment = roundTwo(Math.min(payment, currentBalance));
    bill.paidAmount = roundTwo(Number(bill.paidAmount || 0) + appliedPayment);
    bill.balanceAmount = roundTwo(Math.max(0, Number(bill.grandTotal || 0) - bill.paidAmount));

    if (!Array.isArray(bill.paymentHistory)) {
        bill.paymentHistory = [];
    }

    bill.paymentHistory.push({ amount: appliedPayment, date: Date.now() });
    bill.status = bill.balanceAmount <= 0 ? "PAID" : "PARTIAL";

    await bill.save();

    res.status(200).json({ success: true, message: "Payment updated successfully", bill });
});

exports.shareBillWhatsapp = catchAsyncError(async (req, res, next) => {

    console.log("========== WHATSAPP CONTROLLER REACHED ==========");
    console.log("Bill ID:", req.params?.billId);
    console.log("User ID:", req.user?._id || req.user?.id);

    if (!req.params?.billId || !mongoose.Types.ObjectId.isValid(req.params.billId)) {
        return next(new ErrorHandler("Bill not found", 404));
    }

    // 1. Find the bill belonging to the logged-in user
    const bill = await billModel
        .findOne({
            _id: req.params.billId,
            user: req.user.id
        })
        .populate("items.product");

    if (!bill) {
        return next(new ErrorHandler("Bill not found", 404));
    }

    // 2. Get customer mobile number
    const targetMobile = req.body?.customerMobile || bill.customerMobile;

    if (!targetMobile) {
        return next(
            new ErrorHandler("Customer mobile number is missing", 400)
        );
    }

    // 3. Validate and format Indian mobile number
    const rawNumber = String(targetMobile).replace(/\D/g, "");

    const cleanNumber = rawNumber.startsWith("91") && rawNumber.length === 12
        ? rawNumber.slice(2)
        : (rawNumber.startsWith("0") && rawNumber.length === 11 ? rawNumber.slice(1) : rawNumber);

    if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
        return next(
            new ErrorHandler("Invalid WhatsApp mobile number", 400)
        );
    }

    const formattedNumber = `91${cleanNumber}`;

    // 4. Check WhatsApp configuration
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
    const accessToken = process.env.WHATSAPP_TOKEN?.trim();
    const apiVersion = process.env.WHATSAPP_API_VERSION?.trim() || "v25.0";
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME?.trim();
    const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE?.trim();

    if (!phoneNumberId || !accessToken || !templateName || !templateLanguage) {
        return next(
            new ErrorHandler(
                "WhatsApp configuration is missing. Check backend environment variables.",
                500
            )
        );
    }

    // 5. Prepare template values
    const customerName = String(bill.customerName || "Customer");

    const billDateObj = bill.createdAt ? new Date(bill.createdAt) : new Date();
    const invoiceDate = (Number.isNaN(billDateObj.getTime()) ? new Date() : billDateObj)
        .toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        });

    const paymentMode = String(bill.paymentType || "CASH").toUpperCase();

    const itemsPurchased = String(
        Array.isArray(bill.items) ? bill.items.length : 0
    );

    const grandTotal = Number(bill.grandTotal || 0).toFixed(2);

    // 6. Send approved WhatsApp template
    try {
        const response = await axios.post(
            `https://graph.facebook.com/${apiVersion}/${phoneNumberId}/messages`,
            {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: formattedNumber,
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: templateLanguage
                    },
                    components: [
                        {
                            type: "body",
                            parameters: [
                                {
                                    type: "text",
                                    text: customerName
                                },
                                {
                                    type: "text",
                                    text: invoiceDate
                                },
                                {
                                    type: "text",
                                    text: paymentMode
                                },
                                {
                                    type: "text",
                                    text: itemsPurchased
                                },
                                {
                                    type: "text",
                                    text: grandTotal
                                }
                            ]
                        }
                    ]
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                timeout: 15000
            }
        );

        return res.status(200).json({
            success: true,
            message: "WhatsApp template message accepted by Meta",
            data: response.data
        });

    } catch (err) {
        const metaError = err.response?.data;

        console.error("========== WHATSAPP API ERROR ==========");
        console.error("HTTP Status:", err.response?.status);
        console.error("Meta Error:", JSON.stringify(metaError, null, 2));
        console.error("Error Message:", err.message);
        console.error("========================================");

        const errorMessage =
            metaError?.error?.message ||
            "Failed to send WhatsApp message";

        return next(
            new ErrorHandler(errorMessage, 502)
        );
    }
});