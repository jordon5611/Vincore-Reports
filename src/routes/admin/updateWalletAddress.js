const validateWalletAddress = require('../../HelpingFunctions/validateWalletAddress')
const User = require('../../models/User')
const { NotFoundError } = require('../../errors');

const updateWalletAddress = async (req, res) => {
    const { walletAddress } = req.body;

    const userId = req.params.userId

    const user = await User.findById(userId)

    if(!user){
        throw new NotFoundError('User not Found!')
    }

    await validateWalletAddress(walletAddress);

    user.walletAddress = walletAddress;

    await user.save()

    res.status(200).json({ status: 'success', message: 'Updated new Wallet Address' })
}


module.exports = { updateWalletAddress }
