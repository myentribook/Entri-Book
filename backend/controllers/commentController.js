const Comment = require('../models/commentModel')
const catchAsyncError = require('../middlewares/catchAsyncError')
const ErrorHandler = require('../utils/ErrorHandler')


exports.createComment = catchAsyncError(async (req, res, next) => {


    const { name, comment } = req.body

    if (!comment) {
        return next(new ErrorHandler(`please provide a comment text`, 400))
    }

    const newComment = await Comment.create({
        name: name || 'Anonyms',
        comment
    })

    res.status(200).json({
        success: true,
        comment: newComment
    })

})


exports.getComments = catchAsyncError(async (req, res, next) => {

    const comments = await Comment.find().sort({ createdAt: -1 })

    res.status(200).json({
        success: true,
        count: comments.length,
        comments
    })

})

exports.deleteComment = catchAsyncError(async (req, res, next) => {

    // Variable name-a 'commentDoc' nu maathunga (Capital 'Comment' model-um confuse aagathu)
    const commentDoc = await Comment.findById(req.params.id)

    if (!commentDoc) {
        return next(new ErrorHandler(`Comment not found with this ID ${req.params.id}`, 404))
    }

    await commentDoc.deleteOne()

    res.status(200).json({
        success: true, 
        message: 'Comment deleted Successfully'
    })

})