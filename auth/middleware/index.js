module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Токен не надано');
        }

        const isValid = await require('../funcs/authFuncs')('validateToken')(token);
        if (!isValid) {
            throw new Error('Недійсний токен');
        }

        next();
    } catch (error) {
        res.status(401).json({ message: 'Неавторизований доступ: ' + error.message });
    }
}