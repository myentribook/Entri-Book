const mongoose = require("mongoose");

const billItemSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    saleType: {
        type: String,
        enum: ["bag", "kg"],
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

    total: {
        type: Number,
        required: true
    }

}, { _id: false });

const billSchema = new mongoose.Schema({

    customerName: String,

    items: [billItemSchema],

    customerMobile: {
        type: String,
        required: true
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

    // 🔥 CREDIT SUPPORT ADDED (NEW)
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
    deleteAfter: {
        type: Date,
        default: null,
        expires: 0
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Bill", billSchema);