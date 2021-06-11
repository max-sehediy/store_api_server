const ApiError = require('../error/ApiError');

module.exports = function (err, req, res, next) {
    if (err instanceof ApiError) {
        console.log('error handler1');
        return res.status(err.status).json({ message: err.message })
    }
    console.log('error handler2');
    return res.status(500).json({ message: 'An unforeseen error' })
}