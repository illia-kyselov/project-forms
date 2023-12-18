const authFuncs = require('../funcs/authFuncs');

module.exports = async (res, req) => {
    try {
        const pg = req.pg;
        const { userName, password, email, firstName, secondName, thirdName } = req.body;
        const _q = `insert into admin.user(user_name, password, email, first_name, second_name, third_name) values('${userName}', crypt('${password}', gen_salt('bf')), '${email}', '${firstName}', '${secondName}', '${thirdName}') returning uuid;`;
        const { err, result } = await pg.query(_q);
        if (err) res.status(500).json({ message: err.message });
        const { uuid: clientId } = result.rows[0];
        const { access_token: jwt, token_type: tokenType, expires_in: exp, refresh_token: refreshToken } = await authFuncs('generateToken')(clientId);
        res.json({jwt, tokenType, exp, refreshToken});
    } catch (err) {
        res.status(401).json({ message: err.message });
    }
}