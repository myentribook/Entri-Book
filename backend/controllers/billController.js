const mongoose = require('mongoose');
const billModel = require('../models/billModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeature = require('../utils/apiFeature');
const axios = require('axios');

// ===================== GET CASH BILLS (Searchable) =====================
exports.getBill = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeature(
        billModel.find({ user: req.user.id, paymentType: "CASH" }).populate('items.product'),
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

// ===================== CREATE BILL =====================
exports.createBill = catchAsyncError(async (req, res, next) => {
    const {
        customerName,
        customerMobile,
        items,
        paymentType = "CASH",
        cgstPercent = 0,
        sgstPercent = 0
    } = req.body;

    if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
    if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
    if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

    // Mobile number cleaning & validation
    const cleanMobile = String(customerMobile || "").replace(/\D/g, '');
    const mobileRegex = /^(91)?[6-9]\d{9}$/;

    if (!mobileRegex.test(cleanMobile)) {
        return next(new ErrorHandler("Invalid mobile number", 400));
    }

    const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

    let subTotal = 0;
    const billItems = [];
    const allowedSaleTypes = ["bag", "kg", "litre", "milliliter", "gram"];

    for (const item of items) {
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);

        const saleTypeLower = String(item.saleType || "").toLowerCase();
        if (!allowedSaleTypes.includes(saleTypeLower)) throw new ErrorHandler("Invalid sale type", 400);

        const product = await productModel.findOne({ _id: item.product, user: req.user.id });
        if (!product) throw new ErrorHandler("Product not found", 404);

        let stockToReduce = saleTypeLower === "bag" ? quantity : quantity / Number(product.conversionFactor || 1);

        if (product.stock < stockToReduce) {
            throw new ErrorHandler(`${product.name} has insufficient stock`, 400);
        }

        product.stock = Number((product.stock - stockToReduce).toFixed(4));
        await product.save();

        const itemTotal = quantity * price;
        subTotal += itemTotal;

        // 🔥 Robust HSN Code extraction from Product model variations
        const extractedHsn = product.hsnCode || product.HSNCode || product.hsn || "";

        billItems.push({
            product: product._id,
            saleType: item.saleType,
            quantity,
            price,
            hsnCode: extractedHsn,
            total: Number(itemTotal.toFixed(2))
        });
    }

    subTotal = Number(subTotal.toFixed(2));

    // 🔥 Explicit safe float parsing for tax rates
    const parsedCgstRate = parseFloat(cgstPercent) || 0;
    const parsedSgstRate = parseFloat(sgstPercent) || 0;

    const cgst = Number((subTotal * (parsedCgstRate / 100)).toFixed(2));
    const sgst = Number((subTotal * (parsedSgstRate / 100)).toFixed(2));
    const totalTax = Number((cgst + sgst).toFixed(2));
    const grandTotal = Number((subTotal + totalTax).toFixed(2));

    const finalPaidAmount = paymentType === "CASH" ? grandTotal : 0;
    const balanceAmount = Number((grandTotal - finalPaidAmount).toFixed(2));

    // 🔥 Robust GSTIN extraction from User model variations
    const currentUser = await userModel.findById(req.user.id);
    const gstin = currentUser?.gstin || currentUser?.GSTIN || currentUser?.gstNumber || "";

    // Invoice Number Generation
    const count = await billModel.countDocuments({ user: req.user.id });
    const currentYear = new Date().getFullYear();
    const invoiceNo = `INV-${currentYear}-${String(count + 1).padStart(4, "0")}`;

    const bill = await billModel.create({
        invoiceNo,
        gstin,
        customerName,
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
    const { id, billId } = req.params;
    const targetId = billId || id; 
    const payment = Number(req.body.paidAmount);

    if (isNaN(payment) || payment <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
    }

    const bill = await billModel.findOne({ _id: targetId, user: req.user.id });
    if (!bill || bill.paymentType !== "CREDIT") {
        return next(new ErrorHandler("Credit bill not found", 404));
    }

    if (payment > bill.balanceAmount) {
        return next(new ErrorHandler("Payment exceeds balance", 400));
    }

    bill.paidAmount = Number((bill.paidAmount + payment).toFixed(2));
    bill.balanceAmount = Number((bill.grandTotal - bill.paidAmount).toFixed(2));

    if (!Array.isArray(bill.paymentHistory)) {
        bill.paymentHistory = [];
    }

    bill.paymentHistory.push({ amount: payment, date: Date.now() });
    bill.status = bill.balanceAmount <= 0 ? "PAID" : "PARTIAL";

    await bill.save();

    res.status(200).json({ success: true, message: "Payment updated successfully", bill });
});

// ===================== SHARE BILL VIA WHATSAPP =====================
exports.shareBillWhatsapp = catchAsyncError(async (req, res, next) => {
    const bill = await billModel.findOne({ _id: req.params.billId, user: req.user.id }).populate('items.product');

    if (!bill) {
        return next(new ErrorHandler("Bill not found", 404));
    }

    const { customerMobile } = req.body;
    const targetMobile = customerMobile || bill.customerMobile;

    if (!targetMobile) {
        return next(new ErrorHandler("Customer mobile number is missing", 400));
    }

    const rawNumber = String(targetMobile).replace(/\D/g, '');
    const formattedNumber = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;

    const itemsText = bill.items.map(it => `• ${it.product?.name || 'Item'} (${it.quantity} ${it.saleType}) - ₹${it.total}`).join('\n');

    const messageBody = `🧾 *Tax Invoice*\n` +
        `Invoice No: ${bill.invoiceNo}\n` +
        `Customer: ${bill.customerName}\n\n` +
        `*Items:*\n${itemsText}\n\n` +
        `Subtotal: ₹${bill.subTotal}\n` +
        `CGST: ₹${bill.cgst}\n` +
        `SGST: ₹${bill.sgst}\n` +
        `Total Tax: ₹${bill.totalTax}\n` +
        `*Grand Total: ₹${bill.grandTotal}*\n\n` +
        `Thank you for your business!`;

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: formattedNumber,
                type: "text",
                text: { body: messageBody }
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN?.trim()}`,
                    "Content-Type": "application/json"
                },
                timeout: 10000
            }
        );

        res.status(200).json({
            success: true,
            message: "Invoice sent via WhatsApp successfully",
            data: response.data
        });

    } catch (err) {
        const errorMessage = err.response?.data?.error?.message || "Failed to send WhatsApp message";
        return next(new ErrorHandler(errorMessage, 502));
    }
});