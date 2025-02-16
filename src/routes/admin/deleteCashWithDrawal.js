const CashWithDrawal = require('../../models/CashWithDrawal')

const deleteCashWithDrawal = async (req, res) => {

    const Id = req.params.CashWithDrawalId

    await CashWithDrawal.findByIdAndDelete(Id)

    res.status(201).json({ status: 'success', message: 'Deleted Deposit Sucessfully' })
}


module.exports = { deleteCashWithDrawal }

