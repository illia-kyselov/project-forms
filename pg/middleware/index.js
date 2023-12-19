const { Client } = require('pg');
const { dbParams } = require('../../config/configServer.json');

const client = new Client(dbParams);

client.connect();

module.exports = async (req, res, next) => {
    req.pg = client;
    next();
}