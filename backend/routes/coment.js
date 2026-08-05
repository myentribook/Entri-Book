const express = require('express')

const { createComment , getComments , deleteComment } = require('../controllers/commentController')

const Router = express.Router()

Router.route('/comments').get(getComments)

Router.route('/comment/new').post(createComment)

Router.route('/comment/:id').delete(deleteComment)

module.exports = Router