const jwt = require('jsonwebtoken');
const redisClient = require('./redis-init');


exports.createAccessToken = function(userid) {
    const accessToken = jwt.sign({userid}, process.env.accessToken_secretKey, {expiresIn:'1200s'})
    return accessToken;
}

exports.createRefreshToken = function(userid) {
    const refreshToken = jwt.sign({userid}, process.env.refreshToken_secretKey, {expiresIn:'365d'})
    redisClient.set(userid, refreshToken, {EX:24*60})
    return refreshToken;
}