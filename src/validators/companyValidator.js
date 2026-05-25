const Joi = require('joi');

const companySchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
});

module.exports = { companySchema };
