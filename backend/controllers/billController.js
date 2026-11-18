const mongoose = require('mongoose');
const billModel = require('../models/billModel');
const productModel = require('../models/productModel');
const userModel = require('../models/userModel');
const catchAsyncError = require('../middlewares/catchAsyncError');
const ErrorHandler = require('../utils/ErrorHandler');
const APIFeature = require('../utils/apiFeature');
const axios = require('axios');

// ===================== GET CASH BILLS (Searchable) =====================
// exports.getBill = catchAsyncError(async (req, res, next) => {
//     let filter = { user: req.user.id };

//     // Optional: allow filtering by paymentType if passed in query, otherwise fetch all
//     if (req.query.paymentType) {
//         filter.paymentType = { $regex: new RegExp(`^${req.query.paymentType}$`, 'i') };
//     }

//     const apiFeatures = new APIFeature(
//         billModel.find(filter).populate('items.product'),
//         req.query
//     ).search(['customerName', 'invoiceNo']);

//     const bills = await apiFeatures.query.sort({ createdAt: -1 });

//     res.status(200).json({
//         success: true,
//         message: "Bills fetched successfully",
//         total: bills.length,
//         bills
//     });
// });

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

// ===================== CREATE BILL =====================
// exports.createBill = catchAsyncError(async (req, res, next) => {
//     const {
//         customerName,
//         customerMobile,
//         items,
//         paymentType = "CASH",
//         cgstPercent = 0,
//         sgstPercent = 0
//     } = req.body;

//     if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
//     if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
//     if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

//     // Mobile number cleaning & validation
//     const cleanMobile = String(customerMobile || "").replace(/\D/g, '');
//     const mobileRegex = /^(91)?[6-9]\d{9}$/;

//     if (!mobileRegex.test(cleanMobile)) {
//         return next(new ErrorHandler("Invalid mobile number", 400));
//     }

//     const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

//     let subTotal = 0;
//     const billItems = [];
//     const allowedSaleTypes = ["bag", "kg", "litre", "milliliter", "gram"];

//     for (const item of items) {
//         const quantity = Number(item.quantity);
//         const price = Number(item.price); // Idhu Per Kg / Per Litre / Per Bag price

//         if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);

//         const saleTypeLower = String(item.saleType || "").toLowerCase();
//         if (!allowedSaleTypes.includes(saleTypeLower)) throw new ErrorHandler("Invalid sale type", 400);

//         const product = await productModel.findOne({ _id: item.product, user: req.user.id });
//         if (!product) throw new ErrorHandler("Product not found", 404);

//         let stockToReduce = 0;
//         let itemTotal = 0;
//         const conversion = Number(product.conversionFactor || 1); // e.g., 50 (1 stock = 50 kg)

//         // 🔥 Comprehensive Stock and Price Calculation with Conversion Factor
//         switch (saleTypeLower) {
//             case "bag":
//                 // 1 bag = conversion factor (e.g., 50 kg per stock unit or bag base)
//                 stockToReduce = conversion > 0 ? quantity * (conversion / conversion) : quantity; // or quantity * conversion based on schema
//                 // Let's keep bag reduction as quantity * conversion if 1 bag = conversion kg
//                 stockToReduce = quantity * conversion;
//                 itemTotal = quantity * price; // Or price per bag
//                 break;

//             case "kg":
//             case "litre":
//                 // If 1 stock = conversion kg (e.g., 50 kg), then reducing X kg means X / conversion stock units
//                 stockToReduce = conversion > 0 ? quantity / conversion : quantity;
//                 itemTotal = quantity * price; 
//                 break;

//             case "gram":
//             case "milliliter":
//                 // 1. Convert grams/ml to kg/litre first: quantity / 1000
//                 const totalKgOrLitre = quantity / 1000;

//                 // 2. Reduce stock based on conversion factor (e.g., if 1 stock = 50 kg)
//                 stockToReduce = conversion > 0 ? totalKgOrLitre / conversion : totalKgOrLitre;

//                 // 3. Price calculation: Price is for 1 Kg, so for given grams -> totalKgOrLitre * price
//                 itemTotal = totalKgOrLitre * price; 
//                 break;

//             default:
//                 stockToReduce = conversion > 0 ? quantity / conversion : quantity;
//                 itemTotal = quantity * price;
//                 break;
//         }

//         if (product.stock < stockToReduce) {
//             throw new ErrorHandler(`${product.name} has insufficient stock`, 400);
//         }

//         product.stock = Number((product.stock - stockToReduce).toFixed(4));
//         await product.save();

//         subTotal += itemTotal;

//         // 🔥 Robust HSN Code extraction from Product model variations
//         const extractedHsn = product.hsnCode || product.HSNCode || product.hsn || "";

//         billItems.push({
//             product: product._id,
//             saleType: item.saleType,
//             quantity,
//             price,
//             hsnCode: extractedHsn,
//             total: Number(itemTotal.toFixed(2))
//         });
//     }

//     subTotal = Number(subTotal.toFixed(2));

//     // 🔥 Explicit safe float parsing for tax rates
//     const parsedCgstRate = parseFloat(cgstPercent) || 0;
//     const parsedSgstRate = parseFloat(sgstPercent) || 0;

//     const cgst = Number((subTotal * (parsedCgstRate / 100)).toFixed(2));
//     const sgst = Number((subTotal * (parsedSgstRate / 100)).toFixed(2));
//     const totalTax = Number((cgst + sgst).toFixed(2));
//     const grandTotal = Number((subTotal + totalTax).toFixed(2));

//     const finalPaidAmount = paymentType === "CASH" ? grandTotal : 0;
//     const balanceAmount = Number((grandTotal - finalPaidAmount).toFixed(2));

//     // 🔥 Robust GSTIN extraction from User model variations
//     const currentUser = await userModel.findById(req.user.id);
//     const gstin = currentUser?.gstin || currentUser?.GSTIN || currentUser?.gstNumber || "";

//     // Invoice Number Generation
//     const count = await billModel.countDocuments({ user: req.user.id });
//     const currentYear = new Date().getFullYear();
//     const invoiceNo = `INV-${currentYear}-${String(count + 1).padStart(4, "0")}`;

//     const bill = await billModel.create({
//         invoiceNo,
//         gstin,
//         customerName,
//         customerMobile: formattedMobile,
//         items: billItems,
//         subTotal,
//         cgst,
//         sgst,
//         totalTax,
//         grandTotal,
//         paymentType,
//         paidAmount: finalPaidAmount,
//         balanceAmount,
//         status: balanceAmount <= 0 ? "PAID" : (finalPaidAmount > 0 ? "PARTIAL" : "PENDING"),
//         user: req.user.id,
//         paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
//     });

//     res.status(201).json({
//         success: true,
//         message: "Invoice created successfully",
//         bill
//     });
// });

// exports.createBill = catchAsyncError(async (req, res, next) => {
//     const {
//         customerName,
//         customerMobile,
//         items,
//         paymentType = "CASH",
//         cgstPercent = 0,
//         sgstPercent = 0
//     } = req.body;

//     if (!["CASH", "CREDIT"].includes(paymentType)) return next(new ErrorHandler("Invalid payment type", 400));
//     if (!customerName?.trim()) return next(new ErrorHandler("Customer name is required", 400));
//     if (!items?.length) return next(new ErrorHandler("Please add at least one product", 400));

//     // Mobile number cleaning & validation
//     const cleanMobile = String(customerMobile || "").replace(/\D/g, '');
//     const mobileRegex = /^(91)?[6-9]\d{9}$/;

//     if (!mobileRegex.test(cleanMobile)) {
//         return next(new ErrorHandler("Invalid mobile number", 400));
//     }

//     const formattedMobile = cleanMobile.length === 10 ? `91${cleanMobile}` : cleanMobile;

//     let subTotal = 0;
//     const billItems = [];
//     const allowedSaleTypes = ["bag", "kg"];

//     for (const item of items) {
//         const quantity = Number(item.quantity);
//         const price = Number(item.price); // Per Bag or Per Kg price

//         if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);

//         const saleTypeLower = String(item.saleType || "").toLowerCase();
//         if (!allowedSaleTypes.includes(saleTypeLower)) throw new ErrorHandler("Invalid sale type", 400);

//         const product = await productModel.findOne({ _id: item.product, user: req.user.id });
//         if (!product) throw new ErrorHandler("Product not found", 404);

//         let stockToReduce = 0;
//         let itemTotal = 0;
//         // Fallback to 50 if conversionFactor is missing from product document
//         const conversion = Number(product.conversionFactor || 50);

//         // 🔥 Perfect Stock and Price Calculation for Bag and Kg
//         switch (saleTypeLower) {
//             case "bag":
//                 stockToReduce = quantity; // 1 bag = 1 unit of stock reduction (since stock is in bags)
//                 itemTotal = quantity * price; // Per bag price
//                 break;

//             case "kg":
//                 stockToReduce = conversion > 0 ? quantity / conversion : quantity; // Converts kg input to fractional bags
//                 itemTotal = quantity * price; // Per Kg price
//                 break;

//             default:
//                 stockToReduce = quantity;
//                 itemTotal = quantity * price;
//                 break;
//         }

//         if (product.stock < stockToReduce) {
//             throw new ErrorHandler(`${product.name} has insufficient stock. Available: ${product.stock} bags, Required: ${stockToReduce} bags`, 400);
//         }

//         product.stock = Number((product.stock - stockToReduce).toFixed(4));
//         await product.save();

//         subTotal += itemTotal;

//         // 🔥 Robust HSN Code extraction from Product model variations
//         const extractedHsn = product.hsnCode || product.HSNCode || product.hsn || "";

//         billItems.push({
//             product: product._id,
//             saleType: item.saleType,
//             quantity,
//             price,
//             hsnCode: extractedHsn,
//             total: Number(itemTotal.toFixed(2))
//         });
//     }

//     subTotal = Number(subTotal.toFixed(2));

//     // 🔥 Explicit safe float parsing for tax rates
//     const parsedCgstRate = parseFloat(cgstPercent) || 0;
//     const parsedSgstRate = parseFloat(sgstPercent) || 0;

//     const cgst = Number((subTotal * (parsedCgstRate / 100)).toFixed(2));
//     const sgst = Number((subTotal * (parsedSgstRate / 100)).toFixed(2));
//     const totalTax = Number((cgst + sgst).toFixed(2));
//     const grandTotal = Number((subTotal + totalTax).toFixed(2));

//     const finalPaidAmount = paymentType === "CASH" ? grandTotal : 0;
//     const balanceAmount = Number((grandTotal - finalPaidAmount).toFixed(2));

//     // 🔥 Robust GSTIN extraction from User model variations
//     const currentUser = await userModel.findById(req.user.id);
//     const gstin = currentUser?.gstin || currentUser?.GSTIN || currentUser?.gstNumber || "";

//     // Invoice Number Generation
//     const count = await billModel.countDocuments({ user: req.user.id });
//     const currentYear = new Date().getFullYear();
//     const invoiceNo = `INV-${currentYear}-${String(count + 1).padStart(4, "0")}`;

//     const bill = await billModel.create({
//         invoiceNo,
//         gstin,
//         customerName,
//         customerMobile: formattedMobile,
//         items: billItems,
//         subTotal,
//         cgst,
//         sgst,
//         totalTax,
//         grandTotal,
//         paymentType,
//         paidAmount: finalPaidAmount,
//         balanceAmount,
//         status: balanceAmount <= 0 ? "PAID" : (finalPaidAmount > 0 ? "PARTIAL" : "PENDING"),
//         user: req.user.id,
//         paymentHistory: finalPaidAmount > 0 ? [{ amount: finalPaidAmount, date: Date.now() }] : []
//     });

//     res.status(201).json({
//         success: true,
//         message: "Invoice created successfully",
//         bill
//     });
// });

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
    const allowedSaleTypes = ["bag", "kg"];

    for (const item of items) {
        const quantity = Number(item.quantity);
        const price = Number(item.price);

        if (quantity <= 0 || price <= 0) throw new ErrorHandler("Invalid quantity or price", 400);

        const saleTypeLower = String(item.saleType || "").toLowerCase();
        if (!allowedSaleTypes.includes(saleTypeLower)) throw new ErrorHandler("Invalid sale type", 400);

        const product = await productModel.findOne({ _id: item.product, user: req.user.id });
        if (!product) throw new ErrorHandler("Product not found", 404);

        let stockToReduce = 0;
        let itemTotal = 0;
        const conversion = Number(product.conversionFactor || 50);

        switch (saleTypeLower) {
            case "bag":
                stockToReduce = quantity;
                itemTotal = quantity * price;
                break;
            case "kg":
                stockToReduce = conversion > 0 ? quantity / conversion : quantity;
                itemTotal = quantity * price;
                break;
            default:
                stockToReduce = quantity;
                itemTotal = quantity * price;
                break;
        }

        if (product.stock < stockToReduce) {
            throw new ErrorHandler(`${product.name} has insufficient stock. Available: ${product.stock} bags, Required: ${stockToReduce} bags`, 400);
        }

        product.stock = Number((product.stock - stockToReduce).toFixed(4));
        await product.save();

        subTotal += itemTotal;
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

    const parsedCgstRate = parseFloat(cgstPercent) || 0;
    const parsedSgstRate = parseFloat(sgstPercent) || 0;

    const cgst = Number((subTotal * (parsedCgstRate / 100)).toFixed(2));
    const sgst = Number((subTotal * (parsedSgstRate / 100)).toFixed(2));
    const totalTax = Number((cgst + sgst).toFixed(2));
    const grandTotal = Number((subTotal + totalTax).toFixed(2));

    const finalPaidAmount = paymentType === "CASH" ? grandTotal : 0;
    const balanceAmount = Number((grandTotal - finalPaidAmount).toFixed(2));

    const currentUser = await userModel.findById(req.user.id);
    const gstin = currentUser?.gstin || currentUser?.GSTIN || currentUser?.gstNumber || "";

    // 🚀 FIXED: Safe Invoice Number Generation with Retry Loop (Handles Race Conditions)
    let bill;
    let saved = false;
    let attempts = 0;
    const currentYear = new Date().getFullYear();

    while (!saved && attempts < 5) {
        attempts++;
        try {
            // Find the last invoice created by this specific user
            const lastBill = await billModel.findOne({ user: req.user.id }).sort({ createdAt: -1 });

            let nextSeq = 1;
            if (lastBill && lastBill.invoiceNo) {
                // Extract number from format like "INV-2026-0005"
                const parts = lastBill.invoiceNo.split('-');
                const lastNum = parseInt(parts[parts.length - 1], 10);
                if (!isNaN(lastNum)) {
                    nextSeq = lastNum + 1;
                }
            }

            const invoiceNo = `INV-${currentYear}-${String(nextSeq).padStart(4, "0")}`;

            bill = await billModel.create({
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

            saved = true;
        } catch (err) {
            // If duplicate key error (E11000) occurs on invoiceNo, loop will retry and grab the fresh next number
            if (err.code === 11000 && attempts < 5) {
                continue;
            } else {
                throw err;
            }
        }
    }

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
// exports.shareBillWhatsapp = catchAsyncError(async (req, res, next) => {
//     const bill = await billModel.findOne({ _id: req.params.billId, user: req.user.id }).populate('items.product');

//     if (!bill) {
//         return next(new ErrorHandler("Bill not found", 404));
//     }

//     const { customerMobile } = req.body;
//     const targetMobile = customerMobile || bill.customerMobile;

//     if (!targetMobile) {
//         return next(new ErrorHandler("Customer mobile number is missing", 400));
//     }

//     const rawNumber = String(targetMobile).replace(/\D/g, '');
//     const formattedNumber = rawNumber.startsWith('91') ? rawNumber : `91${rawNumber}`;

//     const itemsText = bill.items.map(it => `• ${it.product?.name || 'Item'} (${it.quantity} ${it.saleType}) - ₹${it.total}`).join('\n');

//     const messageBody = `🧾 *Tax Invoice*\n` +
//         `Invoice No: ${bill.invoiceNo}\n` +
//         `Customer: ${bill.customerName}\n\n` +
//         `*Items:*\n${itemsText}\n\n` +
//         `Subtotal: ₹${bill.subTotal}\n` +
//         `CGST: ₹${bill.cgst}\n` +
//         `SGST: ₹${bill.sgst}\n` +
//         `Total Tax: ₹${bill.totalTax}\n` +
//         `*Grand Total: ₹${bill.grandTotal}*\n\n` +
//         `Thank you for your business!`;

//     try {
//         // const response = await axios.post(
//         //     `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//         //     {
//         //         messaging_product: "whatsapp",
//         //         to: formattedNumber,
//         //         type: "text",
//         //         text: { body: messageBody }
//         //     },
//         //     {
//         //         headers: {
//         //             Authorization: `Bearer ${process.env.WHATSAPP_TOKEN?.trim()}`,
//         //             "Content-Type": "application/json"
//         //         },
//         //         timeout: 10000
//         //     }
//         // );

//         // ===================================================


//         const response = await axios.post(
//             `https://graph.facebook.com/v25.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`,
//             {
//                 messaging_product: "whatsapp",
//                 to: formattedNumber,
//                 type: "template",
//                 template: {
//                     name: "entri_book",
//                     language: {
//                         code: "en"
//                     }
//                 }
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${process.env.WHATSAPP_TOKEN?.trim()}`,
//                     "Content-Type": "application/json"
//                 },
//                 timeout: 10000
//             }
//         );


//         // ===================================================
//         res.status(200).json({
//             success: true,
//             message: "Invoice sent via WhatsApp successfully",
//             data: response.data
//         });

//     } catch (err) {
//         const errorMessage = err.response?.data?.error?.message || "Failed to send WhatsApp message";
//         return next(new ErrorHandler(errorMessage, 502));
//     }
// });


exports.shareBillWhatsapp = catchAsyncError(async (req, res, next) => {

    console.log("========== WHATSAPP CONTROLLER REACHED ==========");
    console.log("Bill ID:", req.params.billId);
    console.log("User ID:", req.user?._id);

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
    const targetMobile = req.body.customerMobile || bill.customerMobile;

    if (!targetMobile) {
        return next(
            new ErrorHandler("Customer mobile number is missing", 400)
        );
    }

    // 3. Validate and format Indian mobile number
    const rawNumber = String(targetMobile).replace(/\D/g, "");

    const cleanNumber = rawNumber.startsWith("91")
        ? rawNumber.slice(2)
        : rawNumber;

    if (!/^[6-9]\d{9}$/.test(cleanNumber)) {
        return next(
            new ErrorHandler("Invalid WhatsApp mobile number", 400)
        );
    }

    const formattedNumber = `91${cleanNumber}`;

    // 4. Check WhatsApp configuration
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
    const accessToken = process.env.WHATSAPP_TOKEN?.trim();
    const apiVersion = process.env.WHATSAPP_API_VERSION || "v25.0";
    const templateName = process.env.WHATSAPP_TEMPLATE_NAME;
    const templateLanguage = process.env.WHATSAPP_TEMPLATE_LANGUAGE;

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

    const invoiceDate = new Date(bill.createdAt)
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
