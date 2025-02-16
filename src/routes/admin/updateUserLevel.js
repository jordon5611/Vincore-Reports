const User = require('../../models/User'); // Adjust the path according to your project structure
const { BadRequestError, NotFoundError } = require('../../errors');
const Quantization = require('../../models/Quantization');

const updateUserLevel = async (req, res) => {
    const userId = req.params.userId;  
    const { level } = req.body;  

    // Fetch user from the database
    const user = await User.findById(userId);

    if (!user) {
        throw new NotFoundError('User not Found!');
    }

    let quantization = await Quantization.findOne({ userId });

    if (!quantization) {
        quantization = new Quantization({userId});
    }

    // Update user's level
    quantization.vipLevel = level;

    // Save the updated user
    await quantization.save();

    res.status(200).json({ status: 'success', message: `User level updated to ${level}.` });
};

module.exports = { updateUserLevel };
