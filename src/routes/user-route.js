const { Router } = require('express');
const { validate } = require('express-validation');

const { userSignup, userLogin, getProfile,
     getTokenfromRefreshToken, logout, resetPassword, 
     forgotPassword, setNewPassword } = require('../controllers/signup-controller');

const { checkAcessToken, checkRefreshToken } = require("../utils/verify-token");
const { signupValidate, loginValidate, passwordValidation } = require('../validations/user-validaton');

const userRouter = Router();


userRouter.post('/signup', validate(signupValidate), userSignup);

userRouter.post('/login', validate(loginValidate), userLogin);

userRouter.get('/profile', checkAcessToken, getProfile);

userRouter.get('/refreshtoken', checkRefreshToken, getTokenfromRefreshToken);

userRouter.get('/logout', checkAcessToken, logout);

userRouter.post('/resetpassword', checkAcessToken, resetPassword);

userRouter.post('/forgot-password', forgotPassword);

userRouter.post('/forgot-password/:id/:token', validate(passwordValidation), setNewPassword);


module.exports = userRouter;
