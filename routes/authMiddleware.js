const JWT = require('jsonwebtoken');
const config = require('../utils/configENV');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Lấy token từ header

    if (token == null) return res.sendStatus(401); // Không có token

    JWT.verify(token, config.SECRETKEY, (err, user) => {
        if (err) return res.sendStatus(403); // Token không hợp lệ

        req.user = user;
        next(); // Tiếp tục xử lý nếu token hợp lệ
    });
};

module.exports = authenticateToken;
