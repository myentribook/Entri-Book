// const express = require('express')

// const { registerUser, Login, Logout, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUsers, getSpecificUser, updateUser, deleteUser } = require('../controllers/authController')

// const { isAuthenticatedUser , AuthorizedRoles } = require('../middlewares/authenticate')

// const Router = express.Router()

// Router.route('/register').post(registerUser)

// Router.route('/login').post(Login)

// Router.route('/logout').get(Logout)

// Router.route('/password/forgot').post(forgotPassword)

// Router.route('/password/reset/:token').post(resetPassword)

// // ----------

// Router.route('/myprofile').get(isAuthenticatedUser, getUserProfile)

// Router.route('/password/change').put(isAuthenticatedUser, changePassword)

// Router.route('/update').put(isAuthenticatedUser, updateProfile)


// //--- ADMIN ---------

// Router.route('/admin/users').get(isAuthenticatedUser, AuthorizedRoles('admin'), getAllUsers)

// Router.route('/admin/user/:id').get(isAuthenticatedUser, AuthorizedRoles('admin'), getSpecificUser)

// Router.route('/admin/user/:id').put(isAuthenticatedUser, AuthorizedRoles('admin'), updateUser)

// Router.route('/admin/user/:id').delete(isAuthenticatedUser, AuthorizedRoles('admin'), deleteUser)

// module.exports = Router


const express = require('express');
const upload = require('../middlewares/multer');


const { registerUser, Login, Logout, forgotPassword, resetPassword, getUserProfile, changePassword, updateProfile, getAllUsers, getSpecificUser, updateUser, deleteUser } = require('../controllers/authController');
const { isAuthenticatedUser, AuthorizedRoles } = require('../middlewares/authenticate');

const Router = express.Router();

// Register route-la multer middleware add panniyachu
Router.route('/register').post(upload.single('avatar'), registerUser);

Router.route('/login').post(Login);
Router.route('/logout').get(Logout);
Router.route('/password/forgot').post(forgotPassword);
Router.route('/password/reset/:token').post(resetPassword);

Router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
Router.route('/password/change').put(isAuthenticatedUser, changePassword);
Router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);
// MUST include the :id parameter
// router.route('/update/:id').put(upload.single('avatar'), updateProfile);

// Admin Routes
Router.route('/admin/users').get(isAuthenticatedUser, getAllUsers);
Router.route('/admin/user/:id').get(isAuthenticatedUser, AuthorizedRoles('admin'), getSpecificUser);
Router.route('/admin/user/:id').put(isAuthenticatedUser, AuthorizedRoles('admin'), updateUser);
Router.route('/admin/user/:id').delete(isAuthenticatedUser, AuthorizedRoles('admin'), deleteUser);

module.exports = Router;