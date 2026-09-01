// models/userModel.js

const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const JWT = require('jsonwebtoken')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'please enter the user name']
    },

    email: {
        type: String,
        required: [true, 'please enter the user email'],
        unique: true,
        validate: [validator.isEmail, 'please enter valid email']
    },

    password: {
        type: String,
        required: [true, 'please enter password'],
        minlength: [6, 'password must be minimum 6 characters'],
        select: false
    },

    avatar: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },

    gstin: {                              // ---new
        type: String,
        default: ""
    },

    role: {
        type: String,
        default: 'user'
    },
    isOnline: {
        type: Boolean,
        default: false
    },
    lastSeen: {
        type: Date,
        default: Date.now
    },
    resetPasswordToken: String,
    resetPasswordTokenExpires: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }

})


// HASH PASSWORD
userSchema.pre('save', async function (next) {

    if (!this.isModified('password')) return

    this.password = await bcrypt.hash(this.password, 10)

})


// JWT TOKEN
userSchema.methods.getJwtToken = function () {

    return JWT.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_SECRET_EXPIRES
        }
    )

}


// PASSWORD CHECK
userSchema.methods.isValidPassword = async function (enteredPassword) {

    return await bcrypt.compare(enteredPassword, this.password)

}



userSchema.methods.getResetToken = function () {

    //Generate Token

    const token = crypto.randomBytes(20).toString('hex');

    //Generate hashed token and set to reset password token

    this.resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex')

    //set token expire time 

    this.resetPasswordTokenExpires = Date.now() + 30 * 60 * 1000

    return token

}


module.exports = mongoose.model('user', userSchema)