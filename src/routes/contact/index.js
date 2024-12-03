const express = require('express');
const { body } = require('express-validator');

//Middlewares

const validatorMiddleware = require('../../../middleware/Validator-MiddleWare');
const Authentication = require('../../../middleware/authentication')


//Router
const router = express.Router()

//Controllers
const { sendMessage } = require('./sendMessage')


router.post('/sendMessage',
    [
        body('email').not().notEmpty().isEmail().withMessage('Invalid email address'),
        body('name').not().notEmpty().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
        body('message').not().notEmpty().isLength({ min: 3 }).withMessage('Message must be at least 3 characters long'),
    ], validatorMiddleware, 
    sendMessage)


module.exports = router