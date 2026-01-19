const { getPool } = require('./database');

const createTables = async () => {
  const pool = getPool();

  try {
    // Users table for authentication
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'staff') DEFAULT 'staff',
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    // Personal Details table
    const personalDetailsTable = `
      CREATE TABLE IF NOT EXISTS resident_details (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resident_id INT,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        suffix VARCHAR(50),
        age INT NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        religion VARCHAR(100) NOT NULL,
        civil_status ENUM('Single', 'Married', 'Widowed', 'Divorced', 'Separated') NOT NULL,
        address VARCHAR(500) NOT NULL,
        occupation VARCHAR(100),
        date_of_birth DATE NOT NULL,
        place_of_birth VARCHAR(255) NOT NULL,
        citizenship VARCHAR(100) NOT NULL DEFAULT 'Filipino',
        employment_status ENUM('Employed', 'Unemployed', 'Self-Employed', 'Student', 'Retired') NOT NULL,
        contact_no VARCHAR(20) NOT NULL,
        province VARCHAR(100) NOT NULL,
        educational_attainment ENUM('Elementary', 'High School', 'College', 'Vocational', 'Postgraduate', 'None') NOT NULL,
        certificate_type ENUM('Indigency', 'Residency', 'Clearance', 'Business Permit') NOT NULL,
        purpose VARCHAR(100) NOT NULL,
        pwd BOOLEAN NOT NULL DEFAULT FALSE,
        tenant BOOLEAN NOT NULL DEFAULT FALSE,
        house_owner_name VARCHAR(255),
        living_with_relative BOOLEAN NOT NULL DEFAULT FALSE,
        relative_name VARCHAR(255),
        relative_relationship VARCHAR(100),
        residency_length ENUM('Less than 1 year', '1-5 years', '6-10 years', 'More than 10 years') NOT NULL,
        registered_voter BOOLEAN NOT NULL DEFAULT FALSE,
        house_owner BOOLEAN NOT NULL DEFAULT FALSE,
        kasambahay BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resident_id) REFERENCES barangay_inhabitants(id) ON DELETE SET NULL,
        INDEX idx_resident_id (resident_id),
        INDEX idx_name (first_name, last_name),
        INDEX idx_certificate_type (certificate_type),
        INDEX idx_created_at (created_at)
      )
    `;

    // Kasambahay Registration table
    const kasambahayTable = `
      CREATE TABLE IF NOT EXISTS kasambahay_registration (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resident_id INT,
        employer_name VARCHAR(255) NOT NULL,
        employer_address VARCHAR(500) NOT NULL,
        monthly_salary VARCHAR(100) NOT NULL,
        nature_of_work VARCHAR(100) NOT NULL,
        employment_arrangement ENUM('Full-time', 'Part-time', 'Contract') NOT NULL,
        sss_no VARCHAR(20),
        pagibig_no VARCHAR(20),
        philhealth_no VARCHAR(20),
        spouse_name VARCHAR(255),
        father_name VARCHAR(255),
        father_address VARCHAR(500),
        mother_name VARCHAR(255),
        mother_address VARCHAR(500),
        emergency_contact_person VARCHAR(255) NOT NULL,
        emergency_contact_no VARCHAR(20) NOT NULL,
        documents TEXT,
        agree_to_terms BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (resident_id) REFERENCES barangay_inhabitants(id) ON DELETE SET NULL,
        INDEX idx_resident_id (resident_id),
        INDEX idx_employer_name (employer_name),
        INDEX idx_created_at (created_at)
      )
    `;

    // Barangay Inhabitants Record table
    const rbiTable = `
      CREATE TABLE IF NOT EXISTS barangay_inhabitants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        region VARCHAR(100) NOT NULL,
        province VARCHAR(100) NOT NULL,
        city_municipality VARCHAR(100) NOT NULL,
        barangay VARCHAR(100) NOT NULL,
        household_no VARCHAR(50) NOT NULL,
        address VARCHAR(500) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        middle_name VARCHAR(255),
        qualifier VARCHAR(50),
        date_of_birth DATE NOT NULL,
        place_of_birth VARCHAR(255) NOT NULL,
        gender ENUM('Male', 'Female', 'Other') NOT NULL,
        civil_status ENUM('Single', 'Married', 'Widowed', 'Divorced', 'Separated') NOT NULL,
        citizenship VARCHAR(100) NOT NULL,
        occupation VARCHAR(100),
        housing_status ENUM('Owned', 'Rented', 'Mortgaged', 'Living with relatives') NOT NULL,
        years_residing INT NOT NULL,
        registered_voter ENUM('Yes', 'No') NOT NULL,
        health_problem VARCHAR(255),
        septic_tank ENUM('Yes', 'No', 'Not Applicable') NOT NULL,
        relationship_to_head VARCHAR(100) NOT NULL,
        date_accomplished DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_household_no (household_no),
        INDEX idx_name (first_name, last_name),
        INDEX idx_created_at (created_at)
      )
    `;

    // Business Permits table
    const businessPermitsTable = `
      CREATE TABLE IF NOT EXISTS business_permits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        resident_id INT,
        application_type ENUM('NEW', 'OLD') DEFAULT 'NEW',
        application_date DATE NOT NULL,
        business_name VARCHAR(255) NOT NULL,
        nature_of_business VARCHAR(255) NOT NULL,
        proprietor_name VARCHAR(255) NOT NULL,
        business_address VARCHAR(500) NOT NULL,
        brn_number VARCHAR(100) NOT NULL,
        dti_number VARCHAR(100) NOT NULL,
        mayors_permit_number VARCHAR(100) NOT NULL,
        date_issued DATE NOT NULL,
        email_address VARCHAR(100) NOT NULL,
        contact_number VARCHAR(20) NOT NULL,
        representative_name VARCHAR(255) NOT NULL,
        position VARCHAR(100) NOT NULL,
        privacy_consent BOOLEAN DEFAULT FALSE,
        control_number VARCHAR(20),
        amount_paid DECIMAL(10,2) DEFAULT 500.00,
        date_paid DATE,
        or_number VARCHAR(50),
        received_by VARCHAR(255),
        date_received DATE,
        valid_until DATE,
        applicant_signature VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (resident_id) REFERENCES barangay_inhabitants(id) ON DELETE SET NULL,
        INDEX idx_resident_id (resident_id),
        INDEX idx_proprietor_name (proprietor_name),
        INDEX idx_business_name (business_name),
        INDEX idx_application_date (application_date),
        INDEX idx_created_at (created_at)
      )
    `;

    // Execute table creations
    await pool.execute(usersTable);
    console.log('✓ Users table ready');

    await pool.execute(personalDetailsTable);
    console.log('✓ Resident details table ready');

    // Add citizenship column to resident_details if it doesn't exist (for existing databases)
    try {
      await pool.execute(`
        ALTER TABLE resident_details
        ADD COLUMN IF NOT EXISTS citizenship VARCHAR(100) NOT NULL DEFAULT 'Filipino'
      `);
      console.log('✓ Citizenship column added to resident_details table');
    } catch (error) {
      // Column might already exist or ALTER TABLE not supported in this MySQL version
      console.log('Note: Citizenship column check completed');
    }

    // Make certificate_type and purpose nullable for admin users to create resident details without them
    try {
      await pool.execute(`
        ALTER TABLE resident_details
        MODIFY COLUMN certificate_type ENUM('Indigency', 'Residency', 'Clearance', 'Business Permit') NULL
      `);
      console.log('✓ certificate_type column made nullable');

      await pool.execute(`
        ALTER TABLE resident_details
        MODIFY COLUMN purpose VARCHAR(100) NULL
      `);
      console.log('✓ purpose column made nullable');
    } catch (error) {
      // Columns might already be nullable or ALTER TABLE not supported in this MySQL version
      console.log('Note: Certificate columns nullability check completed');
    }

    await pool.execute(kasambahayTable);
    console.log('✓ Kasambahay registration table ready');

    await pool.execute(rbiTable);
    console.log('✓ Barangay inhabitants table ready');

    await pool.execute(businessPermitsTable);
    console.log('✓ Business permits table ready');

    // Officials table
    const officialsTable = `
      CREATE TABLE IF NOT EXISTS officials (
        id INT AUTO_INCREMENT PRIMARY KEY,
        position VARCHAR(100) NOT NULL,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        committee VARCHAR(255),
        position_order INT NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_position (position),
        INDEX idx_position_order (position_order)
      )
    `;

    await pool.execute(officialsTable);
    console.log('✓ Officials table ready');

    // Insert default officials if table is empty
    const [existingOfficials] = await pool.execute('SELECT COUNT(*) as count FROM officials');

    if (existingOfficials[0].count === 0) {
      const defaultOfficials = [
        ['Punong Barangay', 'HON. ROCKY DELA CRUZ RABANAL', 'Punong Barangay', '', 1],
        ['Barangay Kagawad', 'Kgd. Roderick M. Hara', 'Barangay Kagawad', 'Committee On Livelihood Cooperative, Industry, And Senior Citizen Affairs', 2],
        ['Barangay Kagawad', 'Kgd. Christopher C. Serrano', 'Barangay Kagawad', 'Committee On Public Order, Public Safety, And Traffic, Welfare And Light', 3],
        ['Barangay Kagawad', 'Kgd. Margaret Lyra Maruzza', 'Barangay Kagawad', 'Committee On Health, Education, Livelihood And Services', 4],
        ['Barangay Kagawad', 'Kgd. Ferdison D. Barbon', 'Barangay Kagawad', 'Committee On Streets And Roads, Good Pavement, Animal Rights Advocacy And Justice', 5],
        ['Barangay Kagawad', 'Kgd. Eloisa R. Fayanes', 'Barangay Kagawad', 'Committee On Sanitation, Beautification, Solid Waste Mgmt, Parks, Public Services, and Communication', 6],
        ['Barangay Kagawad', 'Kgd. Robin C. Portaje', 'Barangay Kagawad', 'Committee On Infrastructure, Public Planning, Building, Finance, And Utilities', 7],
        ['Barangay Kagawad', 'Kgd. Reynaldo SJ. Sara', 'Barangay Kagawad', 'Committee On Sanitation And Environmental Protection', 8],
        ['SK Chairperson', 'John Vincent D. Aliado', 'SK Chairperson', '', 9],
        ['Barangay Secretary', 'Corazon L. Prado', 'Barangay Secretary', '', 10],
        ['Barangay Treasurer', 'Fritzie P. Ubpardo', 'Barangay Treasurer', '', 11],
        ['BPSO Executive Officer', 'Elmer Z. Pinca', 'BPSO Executive Officer', '', 12]
      ];

      for (const official of defaultOfficials) {
        await pool.execute(
          'INSERT INTO officials (position, name, title, committee, position_order) VALUES (?, ?, ?, ?, ?)',
          official
        );
      }
      console.log('✓ Default officials data inserted');
    }

    // Create default admin user if not exists
    const [existingAdmin] = await pool.execute(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (existingAdmin.length === 0) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 12);

      await pool.execute(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
        ['admin', 'admin@barangay.local', hashedPassword, 'admin']
      );
      console.log('✓ Default admin user created (username: admin, password: admin123)');
    }

    console.log('Database initialization completed successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

module.exports = { createTables };
