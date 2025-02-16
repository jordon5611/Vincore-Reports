
const StatusCodes = require('http-status-codes')
const User = require('../../models/User');

const signup = async (req, res) => {
    const { fname, lname, email, password,  role} = req.body;

    const newUser = new User({ fname, lname, email, password, role});

    const token = newUser.createToken()

    await newUser.save()

    const data = {...newUser.toObject(),token}

    res.status(StatusCodes.CREATED).json({ status: 'success', data })
}


module.exports = { signup }

