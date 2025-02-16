const CashWithDrawal = require('../../models/CashWithDrawal')

const getApprovedCashWithDrawal = async (req, res) => {

    const getCashWithDrawal = await CashWithDrawal.find({status:'approved'}).populate('userId')

    res.status(200).json({ status: 'success', getCashWithDrawal, count: getCashWithDrawal.length });

};

module.exports = { getApprovedCashWithDrawal }