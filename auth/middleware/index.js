module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Токен не надано');
        }

        const { user_id: uuid } = await require('../funcs/authFuncs')('validateToken')(token);
        req.uuid = uuid;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Неавторизований доступ: ' + error.message });
    }
}