const mongoose = require('mongoose');
const billModel = require('../models/billModel');
const productModel = require('../models/productModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeature = require('../utils/apiFeature');
const axios = require('axios');

// ===================== GET CASH BILLS (Searchable) =====================
exports.getBill = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeature(
        billModel.find({ user: req.user.id, paymentType: "CASH" }),
        req.query
    ).search(['customerName', 'billNo']); // Searches by Name or Bill Number

    const bills = await apiFeatures.query;

    res.status(200).json({
        success: true,
        message: "Cash bills fetched successfully",
        total: bills.length,
        bills
    });
});

// ===================== CREATE BILL (Atomic Transaction) =====================
// exports.createBill = catchAsyncError(async (req, res, next) => {
//     const { customerName, customerMobile, items, paymentType = "CASH", paidAmount = 0 } = req.body;

//     if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
//     if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
//     if (!/^91[6-9]\d{9}$/.test(String(customerMobile))) return next(new ErrorHandler("Invalid mobile number", 400));
//     if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         let grandTotal = 0;
//         const billItems = [];

//         for (const item of items) {
//             const quantity = Number(item.quantity);
//             const price = Number(item.price);
//             if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);
//             if (!["bag", "kg"].includes(item.saleType)) throw new ErrorHandler("Invalid sale type", 400);

//             const product = await productModel.findOne({ _id: item.product, user: req.user.id }).session(session);
//             if (!product) throw new ErrorHandler("Product not found", 404);

//             let stockToReduce = item.saleType === "bag" ? quantity : quantity / Number(product.conversionFactor);
//             if (product.stock < stockToReduce) throw new ErrorHandler(`${product.name} has insufficient stock`, 400);

//             product.stock = Number((product.stock - stockToReduce).toFixed(4));
//             await product.save({ session });

//             const total = quantity * price;
//             grandTotal += total;
//             billItems.push({ product: product._id, saleType: item.saleType, quantity, price, total });
//         }

//         const finalPaidAmount = paymentType === "CASH" ? grandTotal : Math.min(Number(paidAmount), grandTotal);
//         const balanceAmount = grandTotal - finalPaidAmount;
//         const count = await billModel.countDocuments({ user: req.user.id }).session(session);
//         const billNo = `BILL${String(count + 1).padStart(5, "0")}`;

//         const bill = await billModel.create([{
//             billNo, customerName, customerMobile: String(customerMobile), items: billItems,
//             grandTotal: Number(grandTotal.toFixed(2)), paymentType, paidAmount: finalPaidAmount,
//             balanceAmount, status: balanceAmount > 0 ? "PARTIAL" : "PAID",
//             user: req.user.id,
//             paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
//         }], { session });

//         await session.commitTransaction();
//         res.status(201).json({ success: true, message: "Bill created successfully", bill: bill[0] });
//     } catch (error) {
//         await session.abortTransaction();
//         next(error);
//     } finally {
//         session.endSession();
//     }
// });

// exports.createBill = catchAsyncError(async (req, res, next) => {
//     const { customerName, customerMobile, items, paymentType = "CASH", paidAmount = 0 } = req.body;

//     if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
//     if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
//     if (!/^91[6-9]\d{9}$/.test(String(customerMobile))) return next(new ErrorHandler("Invalid mobile number", 400));
//     if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

//     // Session code ellam remove panniten
//     let grandTotal = 0;
//     const billItems = [];

//     for (const item of items) {
//         const quantity = Number(item.quantity);
//         const price = Number(item.price);
//         if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);
//         if (!["bag", "kg"].includes(item.saleType)) throw new ErrorHandler("Invalid sale type", 400);

//         // Session-ai remove panniten
//         const product = await productModel.findOne({ _id: item.product, user: req.user.id });
//         if (!product) throw new ErrorHandler("Product not found", 404);

//         let stockToReduce = item.saleType === "bag" ? quantity : quantity / Number(product.conversionFactor);
//         if (product.stock < stockToReduce) throw new ErrorHandler(`${product.name} has insufficient stock`, 400);

//         product.stock = Number((product.stock - stockToReduce).toFixed(4));
//         await product.save(); // Session removed

//         const total = quantity * price;
//         grandTotal += total;
//         billItems.push({ product: product._id, saleType: item.saleType, quantity, price, total });
//     }

//     const finalPaidAmount = paymentType === "CASH" ? grandTotal : Math.min(Number(paidAmount), grandTotal);
//     const balanceAmount = grandTotal - finalPaidAmount;

//     // Bill creation
//     const count = await billModel.countDocuments({ user: req.user.id });
//     const billNo = `BILL${String(count + 1).padStart(5, "0")}`;

//     const bill = await billModel.create({ // Array bracket [] remove panniten
//         billNo, customerName, customerMobile: String(customerMobile), items: billItems,
//         grandTotal: Number(grandTotal.toFixed(2)), paymentType, paidAmount: finalPaidAmount,
//         balanceAmount, status: balanceAmount > 0 ? "PARTIAL" : "PAID",
//         user: req.user.id,
//         paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
//     });

//     res.status(201).json({ success: true, message: "Bill created successfully", bill });
// });

// exports.createBill = catchAsyncError(async (req, res, next) => {
//     const { customerName, customerMobile, items, paymentType = "CASH", paidAmount = 0 } = req.body;

//     if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
//     if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
//     if (!/^91[6-9]\d{9}$/.test(String(customerMobile))) return next(new ErrorHandler("Invalid mobile number", 400));
//     if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

//     let grandTotal = 0;
//     const billItems = [];

//     for (const item of items) {
//         const quantity = Number(item.quantity);
//         const price = Number(item.price);
//         if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);
//         if (!["bag", "kg"].includes(item.saleType)) throw new ErrorHandler("Invalid sale type", 400);

//         const product = await productModel.findOne({ _id: item.product, user: req.user.id });
//         if (!product) throw new ErrorHandler("Product not found", 404);

//         let stockToReduce = item.saleType === "bag" ? quantity : quantity / Number(product.conversionFactor);
//         if (product.stock < stockToReduce) throw new ErrorHandler(`${product.name} has insufficient stock`, 400);

//         product.stock = Number((product.stock - stockToReduce).toFixed(4));
//         await product.save();

//         const total = quantity * price;
//         grandTotal += total;
//         billItems.push({ product: product._id, saleType: item.saleType, quantity, price, total });
//     }

//     const finalPaidAmount = paymentType === "CASH" ? grandTotal : Math.min(Number(paidAmount), grandTotal);
//     const balanceAmount = grandTotal - finalPaidAmount;

//     const bill = await billModel.create({
//         customerName,
//         customerMobile: String(customerMobile),
//         items: billItems,
//         grandTotal: Number(grandTotal.toFixed(2)),
//         paymentType,
//         paidAmount: finalPaidAmount,
//         balanceAmount,
//         status: balanceAmount > 0 ? "PARTIAL" : "PAID",
//         user: req.user.id,
//         paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
//     });

//     res.status(201).json({ success: true, message: "Bill created successfully", bill });
// });

exports.createBill = catchAsyncError(async (req, res, next) => {
    const { customerName, customerMobile, items, paymentType = "CASH", paidAmount = 0 } = req.body;

    if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
    if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
    if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

    // Mobile number cleaning & validation (10 digits or 12 digits with 91 both allowed)
    const cleanMobile = String(customerMobile || "").replace(/\D/g, '');
    const mobileRegex = /^(91)?[6-9]\d{9}$/;

    if (!mobileRegex.test(cleanMobile)) {
        return next(new ErrorHandler("Invalid mobile number", 400));
    }

    // Oru vela 10 digit-ah iruntha, munnadi '91'-a add panni save pannikum
    const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

    let grandTotal = 0;
    const billItems = [];

    for (const item of items) {
        const quantity = Number(item.quantity);
        const price = Number(item.price);
        if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);
        if (!["bag", "kg"].includes(item.saleType)) throw new ErrorHandler("Invalid sale type", 400);

        const product = await productModel.findOne({ _id: item.product, user: req.user.id });
        if (!product) throw new ErrorHandler("Product not found", 404);

        let stockToReduce = item.saleType === "bag" ? quantity : quantity / Number(product.conversionFactor);
        if (product.stock < stockToReduce) throw new ErrorHandler(`${product.name} has insufficient stock`, 400);

        product.stock = Number((product.stock - stockToReduce).toFixed(4));
        await product.save();

        const total = quantity * price;
        grandTotal += total;
        billItems.push({ product: product._id, saleType: item.saleType, quantity, price, total });
    }

    const finalPaidAmount = paymentType === "CASH" ? grandTotal : Math.min(Number(paidAmount), grandTotal);
    const balanceAmount = grandTotal - finalPaidAmount;

    // Bill Number generation logic
    const count = await billModel.countDocuments({ user: req.user.id });
    const billNo = `BILL${String(count + 1).padStart(5, "0")}`;

    const bill = await billModel.create({
        billNo,
        customerName,
        customerMobile: formattedMobile, // Formats and saves properly with 91
        items: billItems,
        grandTotal: Number(grandTotal.toFixed(2)),
        paymentType,
        paidAmount: finalPaidAmount,
        balanceAmount,
        status: balanceAmount > 0 ? "PARTIAL" : "PAID",
        user: req.user.id,
        paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
    });

    res.status(201).json({ success: true, message: "Bill created successfully", bill });
});


// ===================== GET CREDIT BILLS (Searchable) =====================
exports.getCreditBills = catchAsyncError(async (req, res, next) => {
    const apiFeatures = new APIFeature(
        billModel.find({ user: req.user.id, paymentType: "CREDIT" }),
        req.query
    ).search(['customerName', 'billNo']);

    const creditBills = await apiFeatures.query.sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: creditBills.length, creditBills });
});

// ===================== UPDATE CREDIT BILL PAYMENT (Atomic) =====================
// exports.updateCreditBillPayment = catchAsyncError(async (req, res, next) => {
//     const { billId } = req.params;
//     const payment = Number(req.body.paidAmount);

//     if (isNaN(payment) || payment <= 0) return next(new ErrorHandler("Invalid amount", 400));

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//         const bill = await billModel.findOne({ _id: billId, user: req.user.id }).session(session);
//         if (!bill || bill.paymentType !== "CREDIT") throw new ErrorHandler("Credit bill not found", 404);
//         if (payment > bill.balanceAmount) throw new ErrorHandler("Payment exceeds balance", 400);

//         bill.paidAmount += payment;
//         bill.balanceAmount = Number(bill.grandTotal) - bill.paidAmount;
//         bill.paymentHistory.push({ amount: payment, date: Date.now() });
//         bill.status = bill.balanceAmount <= 0 ? "PAID" : "PARTIAL";

//         await bill.save({ session });
//         await session.commitTransaction();
//         res.status(200).json({ success: true, message: "Payment updated", bill });
//     } catch (error) {
//         await session.abortTransaction();
//         next(error);
//     } finally {
//         session.endSession();
//     }
// });


// ===================== UPDATE CREDIT BILL PAYMENT (Safe Push) =====================
exports.updateCreditBillPayment = catchAsyncError(async (req, res, next) => {
    const { billId } = req.params;
    const payment = Number(req.body.paidAmount);

    if (isNaN(payment) || payment <= 0) {
        return next(new ErrorHandler("Invalid amount", 400));
    }

    const bill = await billModel.findOne({ _id: billId, user: req.user.id });
    if (!bill || bill.paymentType !== "CREDIT") {
        return next(new ErrorHandler("Credit bill not found", 404));
    }

    if (payment > bill.balanceAmount) {
        return next(new ErrorHandler("Payment exceeds balance", 400));
    }

    bill.paidAmount += payment;
    bill.balanceAmount = Number(bill.grandTotal) - bill.paidAmount;

    // FIXED: Ensure paymentHistory is an array before pushing
    if (!Array.isArray(bill.paymentHistory)) {
        bill.paymentHistory = [];
    }

    bill.paymentHistory.push({ amount: payment, date: Date.now() });
    bill.status = bill.balanceAmount <= 0 ? "PAID" : "PARTIAL";

    await bill.save();

    res.status(200).json({ success: true, message: "Payment updated", bill });
});



// exports.shareBillWhatsapp = catchAsyncError(async (req, res, next) => {
//     const bill = await billModel.findOne({ _id: req.params.billId, user: req.user.id });

//     if (!bill) {
//         return next(new ErrorHandler("Bill not found", 404));
//     }

//     // Frontend-la irunthu anuppura customerMobile-ah req.body-la irunthu edukkuroam
//     const { customerMobile } = req.body;

//     // Frontend number iruntha athai use pannum, illana bill-la irukkura number-ah eduthukkum
//     const targetMobile = customerMobile || bill.customerMobile;

//     if (!targetMobile) {
//         return next(new ErrorHandler("Customer mobile number is missing", 400));
//     }

//     const rawNumber = String(targetMobile).replace(/\D/g, '');
//     const formattedNumber = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;

//     try {
//         const response = await axios.post(
//             `https://graph.facebook.com/v23.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//             {
//                 messaging_product: "whatsapp",
//                 to: formattedNumber,
//                 type: "text",
//                 text: { body: `🧾 Bill No : ${bill.billNo}\nCustomer : ${bill.customerName}\nTotal : ₹${bill.grandTotal}\nThank you!` }
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.WHATSAPP_TOKEN?.trim()}`,
//                     "Content-Type": "application/json"
//                 },
//                 timeout: 10000
//             }
//         );

//         res.status(200).json({
//             success: true,
//             message: "Bill sent",
//             data: response.data
//         });

//     } catch (err) {
//         const errorMessage = err.response?.data?.error?.message || "Failed to send WhatsApp message";
//         return next(new ErrorHandler(errorMessage, 502));
//     }
// });


exports.shareBillWhatsapp = catchAsyncError(async (req, res, next) => {
    const bill = await billModel.findOne({ _id: req.params.billId, user: req.user.id });

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

    try {
        const response = await axios.post(
            `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
            {
                messaging_product: "whatsapp",
                to: formattedNumber,
                type: "text",
                text: { 
                    body: `🧾 Bill No : ${bill.billNo}\nCustomer : ${bill.customerName}\nTotal : ₹${bill.grandTotal}\nThank you!` 
                }
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
            message: "Bill sent",
            data: response.data
        });

    } catch (err) {
        const errorMessage = err.response?.data?.error?.message || "Failed to send WhatsApp message";
        return next(new ErrorHandler(errorMessage, 502));
    }
});