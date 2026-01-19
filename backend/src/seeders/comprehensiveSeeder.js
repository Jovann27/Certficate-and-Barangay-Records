const { getPool } = require('../config/database');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ResidentDetails = require('../models/ResidentDetails');
const Kasambahay = require('../models/Kasambahay');
const BarangayInhabitants = require('../models/BarangayInhabitants');
const BusinessPermit = require('../models/BusinessPermit');
const Official = require('../models/Official');

const seedAllData = async () => {
  const pool = getPool();

  try {
    console.log('🌱 Starting comprehensive database seeding...\n');

    // 1. Seed Users
    console.log('👥 Seeding users...');
    await seedUsers();

    // 2. Seed Officials
    console.log('🏛️  Seeding officials...');
    await seedOfficials();

    // 3. Seed Resident Details
    console.log('🏠 Seeding resident details...');
    await seedResidentDetails();

    // 4. Seed Barangay Inhabitants
    console.log('👨‍👩‍👧‍👦 Seeding barangay inhabitants...');
    await seedBarangayInhabitants();

    // 5. Seed Kasambahay Registrations
    console.log('🧹 Seeding kasambahay registrations...');
    await seedKasambahay();

    // 6. Seed Business Permits
    console.log('🏪 Seeding business permits...');
    await seedBusinessPermits();

    console.log('\n🎉 All seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log('   ✅ Users: Admin and staff accounts');
    console.log('   ✅ Officials: Barangay officials and committee members');
    console.log('   ✅ Resident Details: Sample residents for certificates');
    console.log('   ✅ Barangay Inhabitants: Population records');
    console.log('   ✅ Kasambahay: Household helper registrations');
    console.log('   ✅ Business Permits: Business clearance records');

  } catch (error) {
    console.error('❌ Error during comprehensive seeding:', error);
    throw error;
  }
};

const seedUsers = async () => {
  const usersData = [
    {
      username: 'admin',
      email: 'admin@barangay.local',
      password: 'admin123',
      role: 'admin'
    },
    {
      username: 'staff1',
      email: 'staff1@barangay.local',
      password: 'staff123',
      role: 'staff'
    },
    {
      username: 'staff2',
      email: 'staff2@barangay.local',
      password: 'staff123',
      role: 'staff'
    }
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const userData of usersData) {
    try {
      const existingUser = await User.findByUsername(userData.username);
      if (existingUser) {
        console.log(`   ⏭️  User '${userData.username}' already exists, skipping...`);
        skippedCount++;
        continue;
      }

      await User.createUser(userData);
      console.log(`   ✅ Created user: ${userData.username} (${userData.role})`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creating user '${userData.username}':`, error.message);
    }
  }

  console.log(`   📊 Users: ${createdCount} created, ${skippedCount} skipped`);
};

const seedOfficials = async () => {
  const officialsData = [
    {
      position: 'Punong Barangay',
      name: 'HON. ROCKY DELA CRUZ RABANAL',
      title: 'Punong Barangay',
      committee: 'Executive Committee',
      position_order: 1
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Roderick M. Hara',
      title: 'Barangay Kagawad',
      committee: 'Committee On Livelihood, Cooperative, Industry, And Senior Citizen Affairs',
      position_order: 2
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Christopher C. Serrano',
      title: 'Barangay Kagawad',
      committee: 'Committee On Public Order, Public Safety, And Traffic, Welfare And Light',
      position_order: 3
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Margaret Lyra Maruzza',
      title: 'Barangay Kagawad',
      committee: 'Committee On Health, Education, Livelihood And Services',
      position_order: 4
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Ferdison D. Barbon',
      title: 'Barangay Kagawad',
      committee: 'Committee On Streets And Roads, Good Pavement, Animal Rights Advocacy And Justice',
      position_order: 5
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Eloisa R. Fayanes',
      title: 'Barangay Kagawad',
      committee: 'Committee On Sanitation, Beautification, Solid Waste Mgmt, Parks, Public Services, and Communication',
      position_order: 6
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Robin C. Portaje',
      title: 'Barangay Kagawad',
      committee: 'Committee On Infrastructure, Public Planning, Building, Finance, And Utilities',
      position_order: 7
    },
    {
      position: 'Barangay Kagawad',
      name: 'Kgd. Reynaldo SJ. Sara',
      title: 'Barangay Kagawad',
      committee: 'Committee On Sanitation And Environmental Protection',
      position_order: 8
    },
    {
      position: 'SK Chairman',
      name: 'John Vincent D. Aliado',
      title: 'SK Chairman',
      committee: 'Sangguniang Kabataan',
      position_order: 9
    },
    {
      position: 'Barangay Secretary',
      name: 'Corazon L. Prado',
      title: 'Barangay Secretary',
      committee: 'Administrative',
      position_order: 10
    },
    {
      position: 'Barangay Treasurer',
      name: 'Fritzie P. Ubpardo',
      title: 'Barangay Treasurer',
      committee: 'Finance',
      position_order: 11
    },
    {
      position: 'BPSO Executive Officer',
      name: 'Elmer Z. Pinca',
      title: 'BPSO Executive Officer',
      committee: 'Public Safety and Order',
      position_order: 12
    }
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const officialData of officialsData) {
    try {
      // Check if official already exists by position_order
      const existingOfficial = await Official.findByPositionOrder(officialData.position_order);
      if (existingOfficial) {
        console.log(`   ⏭️  Official '${officialData.name}' already exists, skipping...`);
        skippedCount++;
        continue;
      }

      await Official.createOfficial(officialData);
      console.log(`   ✅ Created official: ${officialData.name}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creating official '${officialData.name}':`, error.message);
    }
  }

  console.log(`   📊 Officials: ${createdCount} created, ${skippedCount} skipped`);
};

const seedResidentDetails = async () => {
  const residentsData = [
    {
      resident_id: null,
      first_name: 'Juan',
      last_name: 'Dela Cruz',
      middle_name: 'Santos',
      suffix: '',
      age: 35,
      gender: 'Male',
      religion: 'Catholic',
      civil_status: 'Married',
      address: '123 Kalusugan Street, Quezon City',
      occupation: 'Teacher',
      date_of_birth: '1989-03-15',
      place_of_birth: 'Quezon City',
      citizenship: 'Filipino',
      employment_status: 'Employed',
      contact_no: '+639123456789',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Indigency',
      purpose: 'Financial Assistance Application',
      pwd: false,
      tenant: false,
      house_owner_name: '',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: 'More than 10 years',
      registered_voter: true,
      house_owner: true,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Maria',
      last_name: 'Santos',
      middle_name: 'Garcia',
      suffix: '',
      age: 28,
      gender: 'Female',
      religion: 'Catholic',
      civil_status: 'Single',
      address: '456 Barangay Road, Quezon City',
      occupation: 'Nurse',
      date_of_birth: '1996-07-22',
      place_of_birth: 'Manila',
      citizenship: 'Filipino',
      employment_status: 'Employed',
      contact_no: '+639987654321',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Residency',
      purpose: 'Job Application',
      pwd: false,
      tenant: true,
      house_owner_name: 'Juan Dela Cruz',
      living_with_relative: true,
      relative_name: 'Juan Dela Cruz',
      relative_relationship: 'Brother',
      residency_length: '6-10 years',
      registered_voter: true,
      house_owner: false,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Pedro',
      last_name: 'Rodriguez',
      middle_name: 'Mendoza',
      suffix: 'Jr.',
      age: 42,
      gender: 'Male',
      religion: 'Catholic',
      civil_status: 'Married',
      address: '789 Community Avenue, Quezon City',
      occupation: 'Business Owner',
      date_of_birth: '1982-11-08',
      place_of_birth: 'Quezon City',
      citizenship: 'Filipino',
      employment_status: 'Self-Employed',
      contact_no: '+639876543210',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Business Permit',
      purpose: 'Business License Renewal',
      pwd: false,
      tenant: false,
      house_owner_name: '',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: 'More than 10 years',
      registered_voter: true,
      house_owner: true,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Ana',
      last_name: 'Gonzales',
      middle_name: 'Torres',
      suffix: '',
      age: 65,
      gender: 'Female',
      religion: 'Catholic',
      civil_status: 'Widowed',
      address: '321 Senior Lane, Quezon City',
      occupation: 'Retired',
      date_of_birth: '1959-05-12',
      place_of_birth: 'Quezon City',
      citizenship: 'Filipino',
      employment_status: 'Retired',
      contact_no: '+639112233445',
      province: 'Metro Manila',
      educational_attainment: 'High School',
      certificate_type: 'Indigency',
      purpose: 'Senior Citizen Pension',
      pwd: false,
      tenant: false,
      house_owner_name: '',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: 'More than 10 years',
      registered_voter: true,
      house_owner: true,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Carlos',
      last_name: 'Martinez',
      middle_name: 'Luna',
      suffix: '',
      age: 22,
      gender: 'Male',
      religion: 'Catholic',
      civil_status: 'Single',
      address: '555 Student Street, Quezon City',
      occupation: 'Student',
      date_of_birth: '2002-01-30',
      place_of_birth: 'Quezon City',
      citizenship: 'Filipino',
      employment_status: 'Student',
      contact_no: '+639556667778',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Residency',
      purpose: 'School Requirements',
      pwd: false,
      tenant: true,
      house_owner_name: 'Maria Santos',
      living_with_relative: true,
      relative_name: 'Maria Santos',
      relative_relationship: 'Aunt',
      residency_length: '1-5 years',
      registered_voter: false,
      house_owner: false,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Elena',
      last_name: 'Cruz',
      middle_name: 'Diaz',
      suffix: '',
      age: 31,
      gender: 'Female',
      religion: 'Catholic',
      civil_status: 'Married',
      address: '111 Family Street, Quezon City',
      occupation: 'Accountant',
      date_of_birth: '1993-04-18',
      place_of_birth: 'Makati',
      citizenship: 'Filipino',
      employment_status: 'Employed',
      contact_no: '+639223344556',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Residency',
      purpose: 'Bank Account Opening',
      pwd: false,
      tenant: false,
      house_owner_name: '',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: '6-10 years',
      registered_voter: true,
      house_owner: true,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Roberto',
      last_name: 'Garcia',
      middle_name: 'Reyes',
      suffix: '',
      age: 45,
      gender: 'Male',
      religion: 'Catholic',
      civil_status: 'Married',
      address: '222 Village Road, Quezon City',
      occupation: 'Driver',
      date_of_birth: '1979-09-25',
      place_of_birth: 'Quezon City',
      citizenship: 'Filipino',
      employment_status: 'Employed',
      contact_no: '+639334455667',
      province: 'Metro Manila',
      educational_attainment: 'High School',
      certificate_type: 'Indigency',
      purpose: 'Medical Assistance',
      pwd: false,
      tenant: true,
      house_owner_name: 'Elena Cruz',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: 'More than 10 years',
      registered_voter: true,
      house_owner: false,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Isabella',
      last_name: 'Torres',
      middle_name: 'Mendoza',
      suffix: '',
      age: 19,
      gender: 'Female',
      religion: 'Catholic',
      civil_status: 'Single',
      address: '333 Youth Avenue, Quezon City',
      occupation: 'Student',
      date_of_birth: '2005-12-03',
      place_of_birth: 'Quezon City',
      citizenship: 'Filipino',
      employment_status: 'Student',
      contact_no: '+639445566778',
      province: 'Metro Manila',
      educational_attainment: 'High School',
      certificate_type: 'Residency',
      purpose: 'Scholarship Application',
      pwd: false,
      tenant: false,
      house_owner_name: '',
      living_with_relative: true,
      relative_name: 'Roberto Garcia',
      relative_relationship: 'Father',
      residency_length: '1-5 years',
      registered_voter: false,
      house_owner: false,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Miguel',
      last_name: 'Lopez',
      middle_name: 'Santiago',
      suffix: 'Sr.',
      age: 58,
      gender: 'Male',
      religion: 'Catholic',
      civil_status: 'Married',
      address: '444 Heritage Lane, Quezon City',
      occupation: 'Retired Police Officer',
      date_of_birth: '1966-06-14',
      place_of_birth: 'Manila',
      citizenship: 'Filipino',
      employment_status: 'Retired',
      contact_no: '+639556677889',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Residency',
      purpose: 'Retirement Benefits',
      pwd: true,
      tenant: false,
      house_owner_name: '',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: 'More than 10 years',
      registered_voter: true,
      house_owner: true,
      kasambahay: false
    },
    {
      resident_id: null,
      first_name: 'Sophia',
      last_name: 'Reyes',
      middle_name: 'Fernandez',
      suffix: '',
      age: 26,
      gender: 'Female',
      religion: 'Catholic',
      civil_status: 'Single',
      address: '777 Modern Street, Quezon City',
      occupation: 'Software Developer',
      date_of_birth: '1998-08-09',
      place_of_birth: 'Taguig',
      citizenship: 'Filipino',
      employment_status: 'Employed',
      contact_no: '+639667788990',
      province: 'Metro Manila',
      educational_attainment: 'College',
      certificate_type: 'Employment',
      purpose: 'Professional License',
      pwd: false,
      tenant: true,
      house_owner_name: 'Miguel Lopez',
      living_with_relative: false,
      relative_name: '',
      relative_relationship: '',
      residency_length: '6-10 years',
      registered_voter: true,
      house_owner: false,
      kasambahay: false
    }
  ];

  let createdCount = 0;
  let skippedCount = 0;

  for (const residentData of residentsData) {
    try {
      const result = await ResidentDetails.create(residentData);
      console.log(`   ✅ Created resident: ${residentData.first_name} ${residentData.last_name}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creating resident '${residentData.first_name} ${residentData.last_name}':`, error.message);
    }
  }

  console.log(`   📊 Resident Details: ${createdCount} created`);
};

const seedBarangayInhabitants = async () => {
  const inhabitantsData = [
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '001',
      address: '123 Kalusugan Street, Quezon City',
      last_name: 'Dela Cruz',
      first_name: 'Juan',
      middle_name: 'Santos',
      qualifier: '',
      date_of_birth: '1989-03-15',
      place_of_birth: 'Quezon City',
      gender: 'Male',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Teacher',
      housing_status: 'Owned',
      years_residing: 15,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-01-15'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '001',
      address: '123 Kalusugan Street, Quezon City',
      last_name: 'Dela Cruz',
      first_name: 'Maria',
      middle_name: 'Santos',
      qualifier: '',
      date_of_birth: '1992-08-20',
      place_of_birth: 'Quezon City',
      gender: 'Female',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Housewife',
      housing_status: 'Owned',
      years_residing: 15,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Spouse',
      date_accomplished: '2024-01-15'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '002',
      address: '456 Barangay Road, Quezon City',
      last_name: 'Santos',
      first_name: 'Maria',
      middle_name: 'Garcia',
      qualifier: '',
      date_of_birth: '1996-07-22',
      place_of_birth: 'Manila',
      gender: 'Female',
      civil_status: 'Single',
      citizenship: 'Filipino',
      occupation: 'Nurse',
      housing_status: 'Rented',
      years_residing: 8,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-01-20'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '003',
      address: '789 Community Avenue, Quezon City',
      last_name: 'Rodriguez',
      first_name: 'Pedro',
      middle_name: 'Mendoza',
      qualifier: 'Jr.',
      date_of_birth: '1982-11-08',
      place_of_birth: 'Quezon City',
      gender: 'Male',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Business Owner',
      housing_status: 'Owned',
      years_residing: 20,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-01-25'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '004',
      address: '321 Senior Lane, Quezon City',
      last_name: 'Gonzales',
      first_name: 'Ana',
      middle_name: 'Torres',
      qualifier: '',
      date_of_birth: '1959-05-12',
      place_of_birth: 'Quezon City',
      gender: 'Female',
      civil_status: 'Widowed',
      citizenship: 'Filipino',
      occupation: 'Retired',
      housing_status: 'Owned',
      years_residing: 45,
      registered_voter: 'Yes',
      health_problem: 'Hypertension',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-02-01'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '005',
      address: '555 Student Street, Quezon City',
      last_name: 'Martinez',
      first_name: 'Carlos',
      middle_name: 'Luna',
      qualifier: '',
      date_of_birth: '2002-01-30',
      place_of_birth: 'Quezon City',
      gender: 'Male',
      civil_status: 'Single',
      citizenship: 'Filipino',
      occupation: 'Student',
      housing_status: 'Living with relatives',
      years_residing: 3,
      registered_voter: 'No',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Nephew',
      date_accomplished: '2024-02-05'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '006',
      address: '111 Family Street, Quezon City',
      last_name: 'Cruz',
      first_name: 'Elena',
      middle_name: 'Diaz',
      qualifier: '',
      date_of_birth: '1993-04-18',
      place_of_birth: 'Makati',
      gender: 'Female',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Accountant',
      housing_status: 'Owned',
      years_residing: 7,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-02-10'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '006',
      address: '111 Family Street, Quezon City',
      last_name: 'Cruz',
      first_name: 'Antonio',
      middle_name: 'Diaz',
      qualifier: '',
      date_of_birth: '1990-11-25',
      place_of_birth: 'Makati',
      gender: 'Male',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Engineer',
      housing_status: 'Owned',
      years_residing: 7,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Spouse',
      date_accomplished: '2024-02-10'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '007',
      address: '222 Village Road, Quezon City',
      last_name: 'Garcia',
      first_name: 'Roberto',
      middle_name: 'Reyes',
      qualifier: '',
      date_of_birth: '1979-09-25',
      place_of_birth: 'Quezon City',
      gender: 'Male',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Driver',
      housing_status: 'Rented',
      years_residing: 12,
      registered_voter: 'Yes',
      health_problem: 'None',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-02-15'
    },
    {
      region: 'NCR',
      province: 'Metro Manila',
      city_municipality: 'Quezon City',
      barangay: 'Kalusugan',
      household_no: '008',
      address: '444 Heritage Lane, Quezon City',
      last_name: 'Lopez',
      first_name: 'Miguel',
      middle_name: 'Santiago',
      qualifier: 'Sr.',
      date_of_birth: '1966-06-14',
      place_of_birth: 'Manila',
      gender: 'Male',
      civil_status: 'Married',
      citizenship: 'Filipino',
      occupation: 'Retired Police Officer',
      housing_status: 'Owned',
      years_residing: 25,
      registered_voter: 'Yes',
      health_problem: 'Diabetes',
      septic_tank: 'Yes',
      relationship_to_head: 'Head',
      date_accomplished: '2024-02-20'
    }
  ];

  let createdCount = 0;

  for (const inhabitantData of inhabitantsData) {
    try {
      const result = await BarangayInhabitants.create(inhabitantData);
      console.log(`   ✅ Created inhabitant record: ${inhabitantData.first_name} ${inhabitantData.last_name}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creating inhabitant '${inhabitantData.first_name} ${inhabitantData.last_name}':`, error.message);
    }
  }

  console.log(`   📊 Barangay Inhabitants: ${createdCount} created`);
};

const seedKasambahay = async () => {
  const kasambahayData = [
    {
      resident_id: null,
      employer_name: 'Dr. Antonio Reyes',
      employer_address: '789 Medical Center, Quezon City',
      monthly_salary: '₱8,000.00',
      nature_of_work: 'Household Helper',
      employment_arrangement: 'Full-time',
      sss_no: '123456789012',
      pagibig_no: '987654321098',
      philhealth_no: '567890123456',
      spouse_name: '',
      father_name: 'Ricardo Cruz',
      father_address: 'Manila',
      mother_name: 'Elena Cruz',
      mother_address: 'Manila',
      emergency_contact_person: 'Ricardo Cruz',
      emergency_contact_no: '+639123456789',
      documents: 'Birth Certificate, SSS ID, Pag-IBIG ID',
      agree_to_terms: true
    },
    {
      resident_id: null,
      employer_name: 'Maria Santos',
      employer_address: '456 Barangay Road, Quezon City',
      monthly_salary: '₱6,500.00',
      nature_of_work: 'Babysitter',
      employment_arrangement: 'Full-time',
      sss_no: '234567890123',
      pagibig_no: '876543210987',
      philhealth_no: '678901234567',
      spouse_name: '',
      father_name: 'Roberto Garcia',
      father_address: 'Quezon City',
      mother_name: 'Carmen Garcia',
      mother_address: 'Quezon City',
      emergency_contact_person: 'Roberto Garcia',
      emergency_contact_no: '+639987654321',
      documents: 'Birth Certificate, SSS ID',
      agree_to_terms: true
    },
    {
      resident_id: null,
      employer_name: 'Pedro Rodriguez',
      employer_address: '789 Community Avenue, Quezon City',
      monthly_salary: '₱7,200.00',
      nature_of_work: 'Household Helper',
      employment_arrangement: 'Full-time',
      sss_no: '345678901234',
      pagibig_no: '765432109876',
      philhealth_no: '789012345678',
      spouse_name: 'Miguel Mendoza',
      father_name: 'Jose Rodriguez',
      father_address: 'Quezon City',
      mother_name: 'Rosa Rodriguez',
      mother_address: 'Quezon City',
      emergency_contact_person: 'Miguel Mendoza',
      emergency_contact_no: '+639876543210',
      documents: 'Birth Certificate, Marriage Certificate, SSS ID, Pag-IBIG ID',
      agree_to_terms: true
    },
    {
      resident_id: null,
      employer_name: 'Elena Cruz',
      employer_address: '111 Family Street, Quezon City',
      monthly_salary: '₱5,800.00',
      nature_of_work: 'Elderly Care',
      employment_arrangement: 'Part-time',
      sss_no: '456789012345',
      pagibig_no: '654321098765',
      philhealth_no: '890123456789',
      spouse_name: '',
      father_name: 'Luis Diaz',
      father_address: 'Makati',
      mother_name: 'Sofia Diaz',
      mother_address: 'Makati',
      emergency_contact_person: 'Luis Diaz',
      emergency_contact_no: '+639223344556',
      documents: 'Birth Certificate, SSS ID, Pag-IBIG ID',
      agree_to_terms: true
    },
    {
      resident_id: null,
      employer_name: 'Miguel Lopez',
      employer_address: '444 Heritage Lane, Quezon City',
      monthly_salary: '₱9,500.00',
      nature_of_work: 'Cook',
      employment_arrangement: 'Full-time',
      sss_no: '567890123456',
      pagibig_no: '543210987654',
      philhealth_no: '901234567890',
      spouse_name: '',
      father_name: 'Carlos Santiago',
      father_address: 'Manila',
      mother_name: 'Maria Santiago',
      mother_address: 'Manila',
      emergency_contact_person: 'Carlos Santiago',
      emergency_contact_no: '+639556677889',
      documents: 'Birth Certificate, SSS ID, Pag-IBIG ID, PhilHealth ID',
      agree_to_terms: true
    }
  ];

  let createdCount = 0;

  for (const kasambahayRecord of kasambahayData) {
    try {
      const result = await Kasambahay.create(kasambahayRecord);
      console.log(`   ✅ Created kasambahay record for employer: ${kasambahayRecord.employer_name}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creating kasambahay record for '${kasambahayRecord.employer_name}':`, error.message);
    }
  }

  console.log(`   📊 Kasambahay Registrations: ${createdCount} created`);
};

const seedBusinessPermits = async () => {
  const businessPermitsData = [
    {
      resident_id: null,
      application_type: 'NEW',
      application_date: '2024-01-10',
      business_name: 'Rodriguez Store',
      nature_of_business: 'Retail Store',
      proprietor_name: 'Pedro Rodriguez',
      business_address: '789 Community Avenue, Quezon City',
      brn_number: 'BRN2024001',
      dti_number: 'DTI2024001',
      mayors_permit_number: 'MP2024001',
      date_issued: '2024-01-15',
      email_address: 'pedro.rodriguez@email.com',
      contact_number: '+639876543210',
      representative_name: 'Pedro Rodriguez',
      position: 'Owner',
      privacy_consent: true,
      control_number: 'BP2024001',
      amount_paid: 500.00,
      date_paid: '2024-01-12',
      or_number: 'OR2024001',
      received_by: 'Pedro Rodriguez',
      applicant_signature: 'Pedro Rodriguez',
      date_received: '2024-01-15',
      valid_until: '2024-12-31'
    },
    {
      resident_id: null,
      application_type: 'NEW',
      application_date: '2024-02-05',
      business_name: 'Fresh Mart Grocery',
      nature_of_business: 'Grocery Store',
      proprietor_name: 'Maria Santos',
      business_address: '456 Barangay Road, Quezon City',
      brn_number: 'BRN2024002',
      dti_number: 'DTI2024002',
      mayors_permit_number: 'MP2024002',
      date_issued: '2024-02-10',
      email_address: 'maria.santos@email.com',
      contact_number: '+639987654321',
      representative_name: 'Maria Santos',
      position: 'Owner',
      privacy_consent: true,
      control_number: 'BP2024002',
      amount_paid: 500.00,
      date_paid: '2024-02-07',
      or_number: 'OR2024002',
      received_by: 'Maria Santos',
      applicant_signature: 'Maria Santos',
      date_received: '2024-02-10',
      valid_until: '2024-12-31'
    },
    {
      resident_id: null,
      application_type: 'RENEWAL',
      application_date: '2024-07-15',
      business_name: 'Kalusugan Pharmacy',
      nature_of_business: 'Pharmacy',
      proprietor_name: 'Dr. Antonio Reyes',
      business_address: '789 Medical Center, Quezon City',
      brn_number: 'BRN2023001',
      dti_number: 'DTI2023001',
      mayors_permit_number: 'MP2023001',
      date_issued: '2024-07-20',
      email_address: 'antonio.reyes@email.com',
      contact_number: '+639123456789',
      representative_name: 'Dr. Antonio Reyes',
      position: 'Owner/Pharmacist',
      privacy_consent: true,
      control_number: 'BP2024003',
      amount_paid: 750.00,
      date_paid: '2024-07-18',
      or_number: 'OR2024003',
      received_by: 'Dr. Antonio Reyes',
      applicant_signature: 'Dr. Antonio Reyes',
      date_received: '2024-07-20',
      valid_until: '2025-07-19'
    },
    {
      resident_id: null,
      application_type: 'NEW',
      application_date: '2024-03-01',
      business_name: 'Elena\'s Accounting Services',
      nature_of_business: 'Accounting Services',
      proprietor_name: 'Elena Cruz',
      business_address: '111 Family Street, Quezon City',
      brn_number: 'BRN2024004',
      dti_number: 'DTI2024004',
      mayors_permit_number: 'MP2024004',
      date_issued: '2024-03-05',
      email_address: 'elena.cruz@email.com',
      contact_number: '+639223344556',
      representative_name: 'Elena Cruz',
      position: 'Owner',
      privacy_consent: true,
      control_number: 'BP2024004',
      amount_paid: 500.00,
      date_paid: '2024-03-03',
      or_number: 'OR2024004',
      received_by: 'Elena Cruz',
      applicant_signature: 'Elena Cruz',
      date_received: '2024-03-05',
      valid_until: '2024-12-31'
    },
    {
      resident_id: null,
      application_type: 'NEW',
      application_date: '2024-04-10',
      business_name: 'Heritage Restaurant',
      nature_of_business: 'Restaurant',
      proprietor_name: 'Miguel Lopez',
      business_address: '444 Heritage Lane, Quezon City',
      brn_number: 'BRN2024005',
      dti_number: 'DTI2024005',
      mayors_permit_number: 'MP2024005',
      date_issued: '2024-04-15',
      email_address: 'miguel.lopez@email.com',
      contact_number: '+639556677889',
      representative_name: 'Miguel Lopez',
      position: 'Owner/Chef',
      privacy_consent: true,
      control_number: 'BP2024005',
      amount_paid: 500.00,
      date_paid: '2024-04-12',
      or_number: 'OR2024005',
      received_by: 'Miguel Lopez',
      applicant_signature: 'Miguel Lopez',
      date_received: '2024-04-15',
      valid_until: '2024-12-31'
    }
  ];

  let createdCount = 0;

  for (const permitData of businessPermitsData) {
    try {
      const result = await BusinessPermit.create(permitData);
      console.log(`   ✅ Created business permit: ${permitData.business_name}`);
      createdCount++;
    } catch (error) {
      console.error(`   ❌ Error creating business permit '${permitData.business_name}':`, error.message);
    }
  }

  console.log(`   📊 Business Permits: ${createdCount} created`);
};

// Run seeder if called directly
if (require.main === module) {
  seedAllData()
    .then(() => {
      console.log('\n🎉 Comprehensive seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Comprehensive seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedAllData, seedUsers, seedOfficials, seedResidentDetails, seedBarangayInhabitants, seedKasambahay, seedBusinessPermits };
