const User = require('../../models/User');
const CashWithDrawal = require('../../models/CashWithDrawal')
const CashDeposit = require('../../models/CashDeposit')
const {NotFoundError} = require('../../errors');

const getUserHistory = async (req, res) => {
    const userId = req.params.userId
    const user = await User.findById(userId)

    if(!user){
        throw new NotFoundError('User not Found!')
    }

    const cashWithdrawal = await CashWithDrawal.find({userId});
    const cashDeposit = await CashDeposit.find({userId});

    

    res.status(200).json({status: 'success', cashDeposit, cashWithdrawal})
}

module.exports = { getUserHistory }