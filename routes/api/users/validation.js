const Joi = require("joi");

const schemaSignupUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "de"] },
    })
    .required(),
  password: Joi.string().required(),
  subsription: Joi.string().optional(),
});

const schemaLoginUser = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net", "de"] },
    })
    .optional(),
  password: Joi.string().optional(),
  subsription: Joi.string().optional(),
});

const schemaUpdateUserSubscription = Joi.object({
  subscription: Joi.string().required(),
});

const validate = async (schema, obj, next) => {
  try {
    await schema.validateAsync(obj);
    next();
  } catch (err) {
    next({
      status: 400,
      message: err.message,
    });
  }
};

module.exports = {
  signupUserValidation: (req, res, next) => {
    return validate(schemaSignupUser, req.body, next);
  },
  loginUserValidation: (req, res, next) => {
    return validate(schemaLoginUser, req.body, next);
  },
  updateUserSubscriptionValidation: (req, res, next) => {
    return validate(schemaUpdateUserSubscription, req.body, next);
  },
};