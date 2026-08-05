const mongoose = require('mongoose')


const commentSchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'please enter your name']
    },
    comment: {
        type: String,
        required: [true, 'please enter your feedback or comment']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})


const commentModel = mongoose.model('comment', commentSchema)

module.exports = commentModel