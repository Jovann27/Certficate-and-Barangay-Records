# Database Seeders

This directory contains database seeding scripts to populate the database with initial data.

## Comprehensive Seeder

The `comprehensiveSeeder.js` script creates sample data for all database tables.

### Usage

```bash
# From the backend directory
npm run seed:all
```

### Data Created

- **Users**: Admin and staff accounts
- **Officials**: Barangay officials and committee members (12 total)
- **Resident Details**: Sample residents for certificates (5 residents)
- **Barangay Inhabitants**: Population records (6 records)
- **Kasambahay**: Household helper registrations (3 records)
- **Business Permits**: Business clearance records (3 permits)

### Features

- ✅ Checks for existing data before creating (prevents duplicates)
- ✅ Creates realistic sample data for testing
- ✅ Provides detailed progress feedback
- ✅ Handles errors gracefully
- ✅ Can be run multiple times safely

### Manual Execution

You can also run the seeder directly:

```bash
node src/seeders/comprehensiveSeeder.js
```

## User Seeder

The `userSeeder.js` script creates default users for the barangay system.

### Usage

```bash
# From the backend directory
npm run seed
```

### Default Users Created

- **Admin User**
  - Username: `admin`
  - Password: `admin123`
  - Role: `admin`

- **Staff Users**
  - Username: `staff1` / Password: `staff123`
  - Username: `staff2` / Password: `staff123`
  - Role: `staff`

### Features

- ✅ Checks for existing users before creating
- ✅ Hashes passwords securely using bcrypt
- ✅ Provides clear feedback during seeding
- ✅ Handles errors gracefully
- ✅ Can be run multiple times safely

### Manual Execution

You can also run the seeder directly:

```bash
node src/seeders/userSeeder.js
```

### Important Notes

- Make sure the database is initialized before running the seeder
- The seeder uses the same database connection as the main application
- Passwords are hashed with salt rounds of 12 for security
- The comprehensive seeder includes user seeding, so running it will create the default users
