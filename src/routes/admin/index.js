const express = require('express');
const { body, param } = require('express-validator');

//Middlewares

const validatorMiddleware = require('../../../middleware/Validator-MiddleWare');
const Authentication = require('../../../middleware/authentication')
const isAdmin = require('../../../middleware/isAdmin');

//Router
const router = express.Router()

//Controllers
// const { getApprovedCashDeposited } = require('../Controller/admin/getApprovedCashDeposited')
// const { getApprovedCashWithDrawal } = require('../Controller/admin/getApprovedCashWithDrawal')
// const { getPendingCashDeposited } = require('../Controller/admin/getPendingCashDeposited')
// const { getPendingCashWithDrawal } = require('../Controller/admin/getPendingCashWithDrawal')
const { sendReport } = require('./sendReport')
const { getOrdersByPaymentStatus } = require('./getOrdersByPaymentStatus')
const { getOrdersByReportStatus } = require('./getOrdersByReportStatus')
const { getAllUsers } = require('./getAllUsers');
const { deleteUser } = require('./deleteUser');
const { login } = require('./login');
const { getAllOrders } = require('./getAllOrders');


router.get('/getAllOrders', Authentication, getAllOrders);
router.get('/getOrdersByPaymentStatus/:status', Authentication, getOrdersByPaymentStatus);
router.get('/getOrdersByReportStatus/:status', Authentication, isAdmin, getOrdersByReportStatus);

// router.get('/getApprovedCashDeposited', Authentication, isAdmin ,getApprovedCashDeposited)
// router.get('/getPendingCashDeposited', Authentication, isAdmin ,getPendingCashDeposited)
// router.patch('/approveCashDeposit/:id', Authentication,
// [
//     param('id').not().notEmpty().isMongoId().withMessage('Invalid CashDeposit Id'),
//     body('additionalAmount').not().notEmpty().not().isString().withMessage('additionalAmount should not be String').isNumeric().withMessage('Invalid additionalAmount')
// ], validatorMiddleware,
// isAdmin , approveCashDeposit)

router.get('/getAllUsers', Authentication, isAdmin, getAllUsers)

router.post('/login', isAdmin, login);

router.delete('/deleteUser/:userId', Authentication, [
    param('userId').not().notEmpty().isMongoId().withMessage('Invalid userId')
], validatorMiddleware, isAdmin ,deleteUser)

// router.delete('/deleteCashDeposit/:CashDepositId', Authentication, [
//     param('CashDepositId').not().notEmpty().isMongoId().withMessage('Invalid CashDeposit Id')
// ], validatorMiddleware, isAdmin ,deleteCashDeposit)

// router.delete('/deleteImageFromSlider/:imageId', Authentication, [
//     param('imageId').not().notEmpty().isMongoId().withMessage('Invalid CashDeposit Id')
// ], validatorMiddleware, isAdmin ,deleteImageFromSlider)

// //Cash WithDrawal

// router.get('/getApprovedCashWithDrawal', Authentication, isAdmin ,getApprovedCashWithDrawal)
// router.get('/getPendingCashWithDrawal', Authentication, isAdmin ,getPendingCashWithDrawal)

// router.get('/getImageSlider', Authentication ,getImageSlider)

router.patch('/sendReport/:orderId', Authentication,
[
    param('orderId').not().notEmpty().isMongoId().withMessage('Invalid Order ID'),
    body('pdfUrl').not().notEmpty().withMessage('Invalid PDF URL')
], validatorMiddleware,
isAdmin , sendReport)

// router.delete('/deleteCashWithDrawal/:CashWithDrawalId', Authentication, [
//     param('CashWithDrawalId').not().notEmpty().isMongoId().withMessage('Invalid Cash WithDrawal Id')
// ], validatorMiddleware, isAdmin ,deleteCashWithDrawal)

// router.delete('/deleteAbout', Authentication, isAdmin ,deleteAbout)

// //UPDATE WALLET ADDRESS

// router.patch('/updateWalletAddress/:userId', Authentication, [
//     param('userId').not().notEmpty().isMongoId().withMessage('Invalid User ID'),
//     body('walletAddress').not().notEmpty().isString().withMessage('Invalid Wallet Address')
// ]
// , validatorMiddleware, isAdmin ,updateWalletAddress)

// //UPdate BALANCE
// router.patch('/updateUserBalance/:userId', Authentication, [
//     param('userId').not().notEmpty().isMongoId().withMessage('Invalid User ID'),
//     body('amount').not().notEmpty().not().isString().withMessage('Amount should not be String').isNumeric().withMessage('Invalid Amount')
// ]
// , validatorMiddleware, isAdmin ,updateUserBalance)


// //UPdate IMage Slider
// router.patch('/updateImageSlider', Authentication, [
//     body('image').not().notEmpty().isString().withMessage('Image should be String')
// ]
// , validatorMiddleware, isAdmin ,updateImageSlider)


// //UPdate About 
// router.patch('/updateAbout', Authentication, [
//     body('content').not().notEmpty().isString().withMessage('About should be String')
// ]
// , validatorMiddleware, isAdmin ,updateAbout)


// //update User Level
// router.patch('/updateUserLevel/:userId', Authentication, [
//     param('userId').not().notEmpty().isMongoId().withMessage('Invalid User ID'),
//     body('level').not().notEmpty().isIn([1, 2, 3, 4, 5, 6]).withMessage('Level should be 1, 2, 3, 4, 5 or 6')
// ]
// , validatorMiddleware, isAdmin ,updateUserLevel)

// // Get User History
// router.get('/getUserHistory/:userId', Authentication, [
//     param('userId').not().notEmpty().isMongoId().withMessage('Invalid User ID')
// ]
// , validatorMiddleware, isAdmin ,getUserHistory)

// //get User Team Contribution
// router.get('/getUserTeamContribution/:userId', Authentication, [
//     param('userId').not().notEmpty().isMongoId().withMessage('Invalid User ID')
// ]
// , validatorMiddleware, isAdmin ,getUserTeamContribution)


module.exports = router