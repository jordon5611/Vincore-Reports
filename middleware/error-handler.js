const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')
const errorhandler = (err, req, res, next) => {
  let customError = {
    status: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    err: err.message || 'Something went wrong'
  }
  if (err.name === 'ValidationError') {
    customError.err = Object.values(err.errors).map((item) => item.message).join(', ')
    customError.status = 400
  }
  if (err.code && err.code === 11000) {
    customError.status = 400;
    customError.err = `This ${Object.keys(err.keyValue)} already Exists`
  }
  if (err.name === 'CastError') {
    customError.status = 404;
    customError.err = `This id ${err.value} is not Found`
  }
  console.log(err)
  return res.status(customError.status).json({ err: customError.err })
}

module.exports = errorhandler
