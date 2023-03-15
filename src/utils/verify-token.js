const createError = require("http-errors");
const jwt = require('jsonwebtoken');
const redisClient = require('./redis-init');

exports.checkAcessToken = async (req,res,next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        if(!bearerHeader) throw createError.Unauthorized("plz enter token");

        const bearer = bearerHeader.split(" ")[1];
        const payload = jwt.verify(bearer, process.env.accessToken_secretKey);

        req.user = payload
        next();
    } catch (error) {
        next(error)
    }
}

exports.checkRefreshToken = async (req,res,next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        if(!bearerHeader) throw createError.Unauthorized("plz enter token");
    
        const bearer = bearerHeader.split(" ")[1];
        const payload = jwt.verify(bearer, process.env.refreshToken_secretKey);

        const storedToken = await redisClient.get(payload.userid);
        if(storedToken !== bearer) throw createError.Unauthorized('invalid user');

        req.user = payload;
        next();
    } catch (error) {
        next(error)
    }
}