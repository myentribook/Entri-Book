const express = require('express');
const router = express.Router();

// Import controller
const { getDashboardData } = require('../controllers/getDashBoardController');

// Import middlewares
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { isSubscribed } = require('../middlewares/isSubscribed');

// Route Definition
// Ensure all functions exist before passing them to the router
if (!getDashboardData || !isAuthenticatedUser || !isSubscribed) {
    console.error("Critical Error: One of the middleware/controller functions is undefined!");
}

router.route('/getDashboard').get( isAuthenticatedUser , isSubscribed ,  getDashboardData);

module.exports = router;
