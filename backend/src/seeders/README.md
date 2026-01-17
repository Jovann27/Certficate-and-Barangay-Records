# Database Seeders

This directory contains database seeding scripts to populate the database with initial data.

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
