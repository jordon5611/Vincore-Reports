const express = require('express');
const { body, param } = require('express-validator');

//Middlewares

const validatorMiddleware = require('../../../middleware/Validator-MiddleWare');
const Authentication = require('../../../middleware/authentication')


//Router
const router = express.Router()

//Controllers
const { login } = require('./login')
const { signup } = require('./signup')

const { updateInformation } = require('./updateInformation')
const { changePassword } = require('./changePassword')
const { sendOptToEmail, checkOTP, setNewPassword } = require('./forgetPassword')
const { getUser } = require('./getUser')

router.post('/login',
   //  [
   //      body('email').not().notEmpty().isEmail().withMessage('Invalid email address'),
   //      body('password').not().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
   //  ], validatorMiddleware, 
    login)

router.post('/signup', 
// [
//    //  body('fname').not().notEmpty().isLength({ min: 3 }).withMessage('Invalid First Name'),
//    //  body('lname').not().notEmpty().isLength({ min: 3 }).withMessage('Invalid Last Name'),
//    //  body('email').not().notEmpty().isEmail().withMessage('Invalid email address'),
//    //  body('password').not().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//    //  body('userType').optional().isIn(['seller', 'buyer']).withMessage('Invalid user type'),
// ], validatorMiddleware,
 signup)

router.patch('/updateInformation',Authentication,
// [
//    //  body('fname').optional().isLength({ min: 3 }).withMessage('Invalid First Name'),
//    //  body('lname').optional().isLength({ min: 3 }).withMessage('Invalid Last Name'),
//    //  body('email').optional().isEmail().withMessage('Invalid email address'),
//    //  body('phoneNumber').optional().isNumeric().withMessage('Invalid phone number'),
//    //  body('address').optional().isString().withMessage('Invalid address'),
//  ],validatorMiddleware, 
 updateInformation)

 router.patch('/changePassword',Authentication,
//  [
//    //  body('currentpassword').not().notEmpty().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//    //  body('newpassword').not().notEmpty().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
//  ],validatorMiddleware, 
 changePassword)

 router.post('/forgetPassword/sendOptToEmail',
//  [
//    //body('email').not().notEmpty().isEmail().withMessage('Invalid email address')
//  ],validatorMiddleware, 
 sendOptToEmail)

 router.post('/forgetPassword/checkOTP',Authentication,
//  [
//    // body('code').not().notEmpty().isNumeric().withMessage('Invalid email address')
//  ],validatorMiddleware, 
 checkOTP)

 router.patch('/forgetPassword/setNewPassword',Authentication,
//  [
//     body('password').not().notEmpty().isString().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
//  ],validatorMiddleware,
  setNewPassword)

 router.get('/getUser',Authentication, getUser)



module.exports = router