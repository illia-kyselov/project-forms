module.exports = (name) => {
    if (!name) return require('../../config/configServer.json')
    else return require('../../config/configServer.json')[name];
}