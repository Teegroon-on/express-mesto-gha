const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../error-classes');

function auth(req, res, next) {
  try {
    const { authorization } = req.headers;
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnauthorizedError('Ошибка! Для выполнения действия необходима авторизация');
    }
    const token = authorization.replace('Bearer ', '');
    let payload;
    try {
      payload = jwt.verify(token, 'secretkey');
    } catch (err) {
      throw new UnauthorizedError('Ошибка! Для выполнения действия необходима авторизация');
    }
    req.user = payload;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { auth };
