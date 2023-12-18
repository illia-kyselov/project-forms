module.exports = (name) => {
    const _pm = require('../grpc');
    return _pm[name];
}