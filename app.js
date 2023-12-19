const express = require('express');
const cors = require('cors');
const authMiddleware = require('./auth/middleware');
const pgMiddleware = require('./pg/middleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authMiddleware);
app.use(pgMiddleware);

// Імпорт маршрутів
const authRoutes = require('./auth/routes');
const pgRoutes = require('./pg/routes');

// Використання маршрутів
app.use('/auth', authRoutes);
app.use('/', pgRoutes);

module.exports = app;