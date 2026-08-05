// const mongoose = require('mongoose');

// const subscriptionSchema = new mongoose.Schema({
//     user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
//     status: { type: String, enum: ['active', 'expired', 'trial', 'lifetime'], default: 'expired' },
//     hasUsedTrial: { type: Boolean, default: false },
//     endDate: { type: Date, default: null },
//     transactionId: { type: String, unique: true, sparse: true },
//     transactionDate: { type: Date }
// });

// subscriptionSchema.methods.isValid = function() {
//     if (this.status === 'lifetime') return true;
//     return this.endDate && this.endDate > new Date();
// };

// module.exports = mongoose.model('Subscription', subscriptionSchema);    

// models/subscriptionModel.js



const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    status: { type: String, enum: ['active', 'expired', 'trial', 'lifetime'], default: 'expired' },
    hasUsedTrial: { type: Boolean, default: false },
    endDate: { type: Date, default: null },
    transactionId: { type: String, unique: true, sparse: true },
    transactionDate: { type: Date }
});

subscriptionSchema.methods.isValid = function() {
    if (this.status === 'lifetime') return true;
    return this.endDate && this.endDate > new Date();
};

module.exports = mongoose.model('Subscription', subscriptionSchema);