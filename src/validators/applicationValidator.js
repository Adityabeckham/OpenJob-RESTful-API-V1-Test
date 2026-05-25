const Joi = require('joi');

const applicationSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().optional().allow('', null),
});

const updateApplicationSchema = Joi.object({
  status: Joi.string().required(),
});

module.exports = { applicationSchema, updateApplicationSchema };
