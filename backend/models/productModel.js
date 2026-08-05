const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    // 1 Bag = ? Kg
    conversionFactor: {
        type: Number
    },

    // Current stock in Kg
    stock: {
        type: Number,
        default: 0
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        //required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("Product", productSchema);