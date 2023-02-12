const jwt = require('jsonwebtoken');
const User = require('../model/user');
const redis = require('../../redis-client');

const authenticateUserToken = async(req, res, next) => {
  try {
    const bearerToken = req.headers.authorization.split(' ')[1];
    if (bearerToken === null) res.sendStatus(401);

    const token = await redis.get(`blacklist_${bearerToken}`);
    if (token) {
      return res.status(301).json({
        type: 'warning',
        message: 'You have to login again',
      });
    }

    const decoded = jwt.verify(bearerToken, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({email: decoded.email});
    if (!user) res.sendStatus(401);
    req.user = user;
    req.tokenExp = decoded.exp;
    req.token = bearerToken;
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = authenticateUserToken;
