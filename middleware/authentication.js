const { UnauthorizedError, NotFoundError } = require('../errors');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const Authentication = async (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader){
        throw new NotFoundError('No Header is Provided')
    }
    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        
        req.user = {userId: decoded.userId, name: decoded.name}
        next()
    } catch (error) {
        throw new UnauthorizedError(error.message);
    }
    
}

module.exports = Authentication