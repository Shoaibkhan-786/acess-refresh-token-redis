const userModel = require('../models/user-model');
const createError = require('http-errors');
const { createAccessToken, createRefreshToken } = require('../utils/create-token');
const redisClient = require('../utils/redis-init');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");


exports.userSignup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        const checkUser = await userModel.findOne({ email: email }).lean();
        if (checkUser) throw createError.Unauthorized(`${email} already registered.`);

        await userModel.create({ username, email, password });
        res.json('user created successfully')
    } catch (error) {
        next(error)
    }
}

exports.userLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const User = await userModel.findOne({ email: email })
        if (!User) throw createError.Unauthorized(`${email} already registered.`);

        const accessToken = createAccessToken(User._id.toString());
        const refreshToken = createRefreshToken(User._id.toString());
        // res.cookie('refreshToken', refreshToken)
        res.json({ accessToken, refreshToken });
    } catch (error) {
        next(error)
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        const userid = req.user.userid;
        const userProfile = await userModel.findById(userid, '-password').lean();
        res.json(userProfile);
    } catch (error) {
        next(error)
    }
}

exports.getTokenfromRefreshToken = async (req, res, next) => {
    try {

        console.log("cookies=======>", req.cookies)
        const userid = req.user.userid;

        const accessToken = createAccessToken(userid);
        const refreshToken = createRefreshToken(userid);
        res.json({ accessToken, refreshToken });
    } catch (error) {
        next(error)
    }
}

exports.logout = async (req, res, next) => {
    const userid = req.user.userid
    await redisClient.del(userid);
    res.json('user deleted');
}

exports.resetPassword = async (req, res, next) => {
    try {
        const { email, password, newPassword } = req.body;
        const user = await userModel.findOne({ email }, '_id password');

        const comparePassword = await user.comparePassword(password);
        if (!comparePassword) throw createError.Unauthorized('plz enter correct password');
        await userModel.findByIdAndUpdate(user._id, { $set: { password: await bcrypt.hash(newPassword, 10) } });
        res.json('done');
    } catch (error) {
        next(error)
    }
}


exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) throw createError.NotFound('user not found');

        const secret = process.env.forgot_password_secret + user.password;
        const payload = {
            _id: user._id,
            email: user.email
        };

        const token = jwt.sign(payload, secret, { expiresIn: '10m' });

        const link = `http//localhost:8080/forgot-password/${user._id}/${token}`;
        res.json({ resetLink: link });
    } catch (error) {
        next(error)
    }
}

exports.setNewPassword = async (req, res, next) => {
    try {
        const { id, token } = req.params;
        const { password, confirmPassword } = req.body;
        let user = await userModel.findById(id);
        if (!user) throw createError.Unauthorized("Id invalid");

        const secret = process.env.forgot_password_secret + user.password;

        const payload = jwt.verify(token, secret);
        if (!payload) throw createError.Unauthorized("invalid token");
        
        const { _id, email } = payload;
        user = await userModel.findOne({_id, email});
        if(!user) throw createError.Unauthorized('something changed in token.')

        await userModel.findByIdAndUpdate(_id, {$set: {password: await bcrypt.hash(confirmPassword, 10)}});
        res.json(`your password is ${password}`);

    } catch (error) {
        next(error)
    }
}