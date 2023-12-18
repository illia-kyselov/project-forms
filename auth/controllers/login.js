const authFuncs = require('../funcs/authFuncs');

module.exports = async (res, req) => {
    try {
        const pg = req.pg;
        const { userName, password } = req.body;
        const _q = `select uuid, (hashed_password = crypt('${password}', hashed_password)) as is_valid from admon.users where username = '${userName}';`
        const { err, result } = await pg.query(_q);
        if (err) res.status(500).json({ message: err.message });
        const { uuid: clientId, is_valid } = result.rows[0] || {};
        if (!is_valid || is_valid === 'false') throw new Error('Невірний пароль');
        const { access_token: jwt, token_type: tokenType, expires_in: exp, refresh_token: refreshToken } = await authFuncs('generateToken')(clientId);
        res.json({jwt, tokenType, exp, refreshToken});
    } catch (err) {
        res.status(401).json({ message: 'Неавторизований доступ: ' + err.message });
    }
}