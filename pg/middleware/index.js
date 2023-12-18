const express = require('express');
const { Client } = require('pg');

const client = new Client({
    user: "postgres",
    host: "localhost",
    database: "mydatabase",
    password: "6006059a",
    port: 5432,
});

client.connect();

module.exports = async (req, res, next) => {
    req.pg = client;
    next();
}