// routes/report.js
const express = require('express');
const router = express.Router();

// உங்கள் கோப்பில் உள்ள பெயருக்கு ஏற்ப இங்கேயும் மாற்றவும்
const { isAuthenticatedUser } = require('../middlewares/authenticate');
const { getDashboardReports } = require('../controllers/reportController');

const { isSubscribed } = require('../middlewares/isSubscribed')


// இப்போது isAuthenticatedUser என்று சரியாகக் கொடுக்கவும்
router.route('/report').get(isAuthenticatedUser, isSubscribed, getDashboardReports);

// router.route('/liveReport').get(isAuthenticatedUser, isSubscribed, getLiveDashboardData)


module.exports = router;