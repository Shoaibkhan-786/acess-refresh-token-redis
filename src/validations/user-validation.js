const Joi = require('joi');

exports.signupValidate = {
    body: Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "in", "org"] },
      }),
      password: Joi.string().min(3).max(8).required(),
    }),
  };


  exports.loginValidate = {
    body: Joi.object({
      email: Joi.string().email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "in", "org"] },
      }),
      password: Joi.string().min(3).max(8).required(),
    }),
  };

exports.passwordValidation = {
    body: Joi.object({
        password: Joi.string().min(3).max(8).required(),
        confirmPassword: Joi.any().equal(Joi.ref('password')).required()
    })
}