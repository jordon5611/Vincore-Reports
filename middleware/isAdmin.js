const User = require('../models/User');

const isAdmin = async (req, res, next) => {

    const user = await User.findById(req.user.userId)
    
    if (user.role == 'admin') {
        next();
    } else {
        res.status(403).send('Forbidden');
    }

};

module.exports = isAdmin 