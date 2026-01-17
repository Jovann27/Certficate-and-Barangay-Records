const { personalDetailsSchema, kasambahaySchema, barangayInhabitantsSchema, businessPermitSchema, loginSchema, registerSchema } = require('../validation/schemas');

const validate = (schema) => {
  return (req, res, next) => {
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
  validatePersonalDetails: validate(personalDetailsSchema),
  validateKasambahay: validate(kasambahaySchema),
  validateBarangayInhabitants: validate(barangayInhabitantsSchema),
  validateBusinessPermit: validate(businessPermitSchema),
  validateLogin: validate(loginSchema),
  validateRegister: validate(registerSchema)
};
