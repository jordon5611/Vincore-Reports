const User = require('../../models/User');


const getAllUsers = async (req, res) => {

    const users = await User.find({ role: 'user' });


    res.status(200).json({ status: 'success', users: users });

};

module.exports = { getAllUsers }