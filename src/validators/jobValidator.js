const Joi = require('joi');

const jobSchema = Joi.object({
  company_id: Joi.string().required(),
  category_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  job_type: Joi.string().optional().allow('', null),
  experience_level: Joi.string().optional().allow('', null),
  location_type: Joi.string().optional().allow('', null),
  location_city: Joi.string().optional().allow('', null),
  salary_min: Joi.number().optional().allow(null),
  salary_max: Joi.number().optional().allow(null),
  is_salary_visible: Joi.boolean().optional(),
  status: Joi.string().optional().allow('', null),
});

const updateJobSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional().allow('', null),
  salary_max: Joi.number().optional().allow(null),
}).unknown(true);

module.exports = { jobSchema, updateJobSchema };
