const CashDeposit = require('../../models/CashDeposit')

const getApprovedCashDeposited = async (req, res) => {

    const getCashDeposited = await CashDeposit.find({status:'approved'}).populate('userId')

    res.status(200).json({ status: 'success', getCashDeposited, count: getCashDeposited.length });

};

module.exports = { getApprovedCashDeposited }