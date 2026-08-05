const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },

    quantity: {
        type: Number,   
        required: true,
        min: 1
    },

    conversionFactor: {
        type: Number,
        required: true,
        min: 1
    },

    purchasePrice: {
        type: Number,
        required: true,
        min: 0
    },

    totalAmount: {
        type: Number,
        required: true,
        min: 0
    }

}, { _id: false });

const purchaseSchema = new mongoose.Schema({

    supplierName: {
        type: String,
        required: true,
        trim: true
    },

    supplierBillNo: {
        type: String,
        required: true,
        trim: true
    },

    items: {
        type: [purchaseItemSchema],
        required: true,
        validate: {
            validator: function (items) {
                return items.length > 0;
            },
            message: "At least one item is required"
        }
    },

    grandTotal: {
        type: Number,
        required: true,
        min: 0
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Purchase", purchaseSchema);