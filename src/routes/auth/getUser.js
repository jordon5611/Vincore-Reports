const User = require('../../models/User')

const getUser = async (req, res) => {

    const id = req.user.userId

    const user = await User.findById(id);

    res.status(200).json({status:'true' ,user });

};

module.exports = { getUser }