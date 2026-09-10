const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    saleType: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    hsnCode: {
        type: String
    },
    total: {
        type: Number,
        required: true
    }
}, { _id: false });

const billSchema = new mongoose.Schema({
    invoiceNo: {
        type: String,
        required: true,
        unique: true
    },
    gstin: {
        type: String
    },
    customerName: String,
    items: [billItemSchema],
    customerMobile: {
        type: String,
        required: true
    },
    subTotal: {
        type: Number,
        default: 0
    },
    cgst: {
        type: Number,
        default: 0
    },
    sgst: {
        type: Number,
        default: 0
    },
    totalTax: {
        type: Number,
        default: 0
    },
    grandTotal: {
        type: Number,
        default: 0
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    paymentType: {
        type: String,
        enum: ["CASH", "CREDIT"],
        default: "CASH"
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    balanceAmount: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ["PAID", "PARTIAL", "PENDING"],
        default: "PAID"
    },
    paymentHistory: [
        {
            amount: Number, 
            date: { type: Date, default: Date.now }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model("Bill", billSchema);