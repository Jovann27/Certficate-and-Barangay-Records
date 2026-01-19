const { personalDetailsSchema, kasambahaySchema, barangayInhabitantsSchema, businessPermitSchema, loginSchema, registerSchema } = require('../validation/schemas');
const Joi = require('joi');

// Conditional schema for personal details based on user role
const getPersonalDetailsSchema = (req) => {
  const isAdmin = req.user && req.user.role === 'admin';

  return Joi.object({
    resident_id: Joi.number().integer().min(1).allow(null),
    first_name: Joi.string().min(1).max(255).required(),
    last_name: Joi.string().min(1).max(255).required(),
    middle_name: Joi.string().max(255).allow(''),
    suffix: Joi.string().max(50).allow(''),
    age: Joi.number().integer().min(1).max(150).required(),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    religion: Joi.string().max(100).required(),
    civil_status: Joi.string().valid('Single', 'Married', 'Widowed', 'Divorced', 'Separated').required(),
    address: Joi.string().max(500).required(),
    occupation: Joi.string().max(100).allow(''),
    date_of_birth: Joi.date().required(),
    place_of_birth: Joi.string().max(255).required(),
    citizenship: Joi.string().max(100).required(),
    employment_status: Joi.string().valid('Employed', 'Unemployed', 'Self-Employed', 'Student', 'Retired').required(),
    contact_no: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).required(),
    province: Joi.string().max(100).required(),
    educational_attainment: Joi.string().valid('Elementary', 'High School', 'College', 'Vocational', 'Postgraduate', 'None').required(),
    certificate_type: Joi.string().valid('Indigency', 'Residency', 'Clearance', 'Business Permit').allow(null, '').optional(),
    purpose: Joi.string().max(100).allow(null, '').optional(),
    pwd: Joi.boolean().required(),
    tenant: Joi.boolean().required(),
    house_owner_name: Joi.string().max(255).when('tenant', { is: true, then: Joi.required() }),
    living_with_relative: Joi.boolean().required(),
    relative_name: Joi.string().max(255).when('living_with_relative', { is: true, then: Joi.required() }),
    relative_relationship: Joi.string().max(100).when('living_with_relative', { is: true, then: Joi.required() }),
    residency_length: Joi.string().valid('Less than 1 year', '1-5 years', '6-10 years', 'More than 10 years').required(),
    registered_voter: Joi.boolean().required(),
    house_owner: Joi.boolean().required(),
    kasambahay: Joi.boolean().required()
  });
};

const validate = (schemaOrFn) => {
  return (req, res, next) => {
    let schema;
    if (typeof schemaOrFn === 'function') {
      schema = schemaOrFn(req);
    } else {
      schema = schemaOrFn;
    }

    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    req.body = value; // Use validated and sanitized data
    next();
  };
};

module.exports = {
  validatePersonalDetails: validate(getPersonalDetailsSchema),
  validateKasambahay: validate(kasambahaySchema),
  validateBarangayInhabitants: validate(barangayInhabitantsSchema),
  validateBusinessPermit: validate(businessPermitSchema),
  validateLogin: validate(loginSchema),
  validateRegister: validate(registerSchema)
};
