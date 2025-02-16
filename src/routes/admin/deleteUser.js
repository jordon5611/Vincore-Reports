const User = require('../../models/User')
const { NotFoundError } = require('../../../errors');

const deleteUser = async (req, res) => {

    const id = req.params.userId

    const user = await User.findById(id)

    if(!user){
        throw new NotFoundError('User not found')
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({ status: 'success', message: 'Successfully Delete the Account' });

};

module.exports = { deleteUser }