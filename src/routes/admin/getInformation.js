const CashDeposit = require('../../models/CashDeposit')
const CashWithDrawal = require('../../models/CashWithDrawal')
const User = require('../../models/User')

const getInformation = async (req, res) => {

    const TotalUsers = await User.countDocuments({role: 'user'})

    const getCashDeposited = await CashDeposit.countDocuments()

    const getCashWithDrawal = await CashWithDrawal.countDocuments()

    res.status(200).json({ status: 'success', getCashDeposited, getCashWithDrawal ,TotalUsers });

};

module.exports = { getInformation }