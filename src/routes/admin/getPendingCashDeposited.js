const CashDeposit = require('../../models/CashDeposit')

const getPendingCashDeposited = async (req, res) => {

    const getCashDeposited = await CashDeposit.find({status:'pending'}).populate('userId')

    res.status(200).json({ status: 'success', getCashDeposited, count: getCashDeposited.length });

};

module.exports = { getPendingCashDeposited }