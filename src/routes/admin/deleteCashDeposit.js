const CashDeposit = require('../../models/CashDeposit')

const deleteCashDeposit = async (req, res) => {

    const Id = req.params.CashDepositId

    await CashDeposit.findByIdAndDelete(Id)

    res.status(201).json({ status: 'success', message: 'Deleted Deposit Sucessfully' })
}


module.exports = { deleteCashDeposit }

