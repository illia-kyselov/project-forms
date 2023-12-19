const getConfig = require('../controllers/getConfig');

module.exports = async (req, res, next) => {
    req.util.getConfig = getConfig;
    next();
}