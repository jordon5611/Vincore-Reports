const CashWithDrawal = require('../../models/CashWithDrawal')

const getPendingCashWithDrawal = async (req, res) => {

    const getCashWithDrawal = await CashWithDrawal.find({status:'pending'}).populate('userId')

    res.status(200).json({ status: 'success', getCashWithDrawal, count: getCashWithDrawal.length });

};

module.exports = { getPendingCashWithDrawal }