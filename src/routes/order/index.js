const express = require('express');
const { body, param } = require('express-validator');

//Middlewares

const validatorMiddleware = require('../../../middleware/Validator-MiddleWare');
const Authentication = require('../../../middleware/authentication')


//Router
const router = express.Router()

//Controllers
const { createOrder } = require('./createOrder')
const { getOrder } = require('./getOrder')
const { getOrdersOfUser } = require('./getOrdersOfUser')

router.post('/createOrder',
   //  [
   //      body('email').not().notEmpty().isEmail().withMessage('Invalid email address'),
   //      body('password').not().notEmpty().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
   //  ], validatorMiddleware, 
   createOrder)


router.get('/get-order/:orderId', Authentication ,getOrder)

router.get('/getOrdersOfUser/:userId', Authentication, getOrdersOfUser)

module.exports = router