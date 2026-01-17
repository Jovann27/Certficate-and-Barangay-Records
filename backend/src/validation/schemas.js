const Joi = require('joi');

// Personal Details Validation Schema
const personalDetailsSchema = Joi.object({
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
  employment_status: Joi.string().valid('Employed', 'Unemployed', 'Self-Employed', 'Student', 'Retired').required(),
  contact_no: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).required(),
  province: Joi.string().max(100).required(),
  educational_attainment: Joi.string().valid('Elementary', 'High School', 'College', 'Vocational', 'Postgraduate', 'None').required(),
  certificate_type: Joi.string().valid('Indigency', 'Residency', 'Clearance', 'Business Permit').required(),
  purpose: Joi.string().max(100).required(),
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

// Kasambahay Registration Validation Schema
const kasambahaySchema = Joi.object({
  resident_id: Joi.number().integer().min(1).allow(null),
  employer_name: Joi.string().min(1).max(255).required(),
  employer_address: Joi.string().max(500).required(),
  monthly_salary: Joi.string().max(100).required(),
  nature_of_work: Joi.string().max(100).required(),
  employment_arrangement: Joi.string().valid('Full-time', 'Part-time', 'Contract').required(),
  sss_no: Joi.string().pattern(/^[0-9\-]+$/).max(20).allow(''),
  pagibig_no: Joi.string().pattern(/^[0-9\-]+$/).max(20).allow(''),
  philhealth_no: Joi.string().pattern(/^[0-9\-]+$/).max(20).allow(''),
  spouse_name: Joi.string().max(255).allow(''),
  father_name: Joi.string().max(255).allow(''),
  father_address: Joi.string().max(500).allow(''),
  mother_name: Joi.string().max(255).allow(''),
  mother_address: Joi.string().max(500).allow(''),
  emergency_contact_person: Joi.string().max(255).required(),
  emergency_contact_no: Joi.string().pattern(/^[0-9+\-\s()]+$/).max(20).required(),
  documents: Joi.string().allow(''),
  agree_to_terms: Joi.boolean().valid(true).required()
});

// Barangay Inhabitants Record Validation Schema
const barangayInhabitantsSchema = Joi.object({
  region: Joi.string().max(100).required(),
  province: Joi.string().max(100).required(),
  city_municipality: Joi.string().max(100).required(),
  barangay: Joi.string().max(100).required(),
  household_no: Joi.string().max(50).required(),
  address: Joi.string().max(500).required(),
  last_name: Joi.string().min(1).max(255).required(),
  first_name: Joi.string().min(1).max(255).required(),
  middle_name: Joi.string().max(255).allow(''),
  qualifier: Joi.string().max(50).allow(''),
  date_of_birth: Joi.date().required(),
  place_of_birth: Joi.string().max(255).required(),
  gender: Joi.string().valid('Male', 'Female', 'Other').required(),
  civil_status: Joi.string().valid('Single', 'Married', 'Widowed', 'Divorced', 'Separated').required(),
  citizenship: Joi.string().max(100).required(),
  occupation: Joi.string().max(100).allow(''),
  housing_status: Joi.string().valid('Owned', 'Rented', 'Mortgaged', 'Living with relatives').required(),
  years_residing: Joi.number().integer().min(0).max(100).required(),
  registered_voter: Joi.string().valid('Yes', 'No').required(),
  health_problem: Joi.string().max(255).allow(''),
  septic_tank: Joi.string().valid('Yes', 'No', 'Not Applicable').required(),
  relationship_to_head: Joi.string().max(100).required(),
  date_accomplished: Joi.date().required()
});

// Business Permit Validation Schema
const businessPermitSchema = Joi.object({
  proprietor_name: Joi.string().min(1).max(255).required(),
  business_name: Joi.string().min(1).max(255).required(),
  nature_of_business: Joi.string().max(255).required(),
  business_address: Joi.string().max(500).required(),
  amount_paid: Joi.number().min(0).precision(2).required(),
  date_paid: Joi.date().required(),
  or_number: Joi.string().max(50).required(),
  received_by: Joi.string().max(255).required(),
  applicant_signature: Joi.string().max(255).allow(''),
  date_received: Joi.date().required(),
  valid_until: Joi.date().required()
});

// Auth Validation Schemas
const loginSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(50).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('admin', 'staff').default('staff')
});

module.exports = {
  personalDetailsSchema,
  kasambahaySchema,
  barangayInhabitantsSchema,
  businessPermitSchema,
  loginSchema,
  registerSchema
};
