const CashWithDrawal = require('../../models/CashWithDrawal')
const {  NotFoundError, BadRequestError } = require('../../errors')
const User = require('../../models/User')

const approveCashWithDrawal = async (req, res) => {

        //Adding 1 for Admin

        const AdminId = req.user.userId

        const admin = await User.findById(AdminId)
    
        admin.balance += 1;
    
        await admin.save()
    
        //---------------------------

    const id = req.params.id

    const { status } = req.body

    const cashWithDrawal = await CashWithDrawal.findById(id)

    if(cashWithDrawal.status == 'approved'){
        throw new BadRequestError('Cash Deposit is already Approved')
    }

    cashWithDrawal.status = status

    await cashWithDrawal.save()

    const userId = cashWithDrawal.userId

    const user = await User.findById(userId)

    if(!user){
        throw new NotFoundError('User not Found!')
    }

    user.balance -= cashWithDrawal.amount

    await user.save()

    res.status(200).json({ status: 'success', cashWithDrawal , message: 'Balance is successfully updated'});

};

module.exports = { approveCashWithDrawal }