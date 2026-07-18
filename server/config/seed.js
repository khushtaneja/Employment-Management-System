const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Employee = require('../models/Employee');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🌱 Seeding default users...');

      // Create users with pre-hashed passwords (bypass pre-save hook for seeding)
      const adminPasswordHash = await bcrypt.hash('Admin@123', 12);
      const userPasswordHash = await bcrypt.hash('User@123', 12);

      await User.insertMany([
        {
          username: 'admin',
          passwordHash: adminPasswordHash,
          email: 'admin@employeemanagement.com',
          role: 'Admin',
        },
        {
          username: 'user',
          passwordHash: userPasswordHash,
          email: 'user@employeemanagement.com',
          role: 'User',
        },
      ]);

      console.log('✅ Default users seeded: admin (Admin@123), user (User@123)');
    }

    const employeeCount = await Employee.countDocuments();
    if (employeeCount === 0) {
      console.log('🌱 Seeding sample employees...');

      await Employee.insertMany([
        {
          firstName: 'John',
          lastName: 'Doe',
          email: 'john.doe@company.com',
          department: 'Engineering',
          position: 'Senior Software Engineer',
          salary: 95000,
          dateOfJoining: new Date('2020-01-15'),
          isActive: true,
        },
        {
          firstName: 'Jane',
          lastName: 'Smith',
          email: 'jane.smith@company.com',
          department: 'HR',
          position: 'HR Manager',
          salary: 75000,
          dateOfJoining: new Date('2019-03-10'),
          isActive: true,
        },
        {
          firstName: 'Mike',
          lastName: 'Johnson',
          email: 'mike.johnson@company.com',
          department: 'Finance',
          position: 'Financial Analyst',
          salary: 68000,
          dateOfJoining: new Date('2021-06-01'),
          isActive: true,
        },
        {
          firstName: 'Sarah',
          lastName: 'Williams',
          email: 'sarah.williams@company.com',
          department: 'Marketing',
          position: 'Marketing Specialist',
          salary: 62000,
          dateOfJoining: new Date('2022-02-14'),
          isActive: true,
        },
        {
          firstName: 'David',
          lastName: 'Brown',
          email: 'david.brown@company.com',
          department: 'Operations',
          position: 'Operations Manager',
          salary: 82000,
          dateOfJoining: new Date('2018-11-05'),
          isActive: true,
        },
        {
          firstName: 'Emily',
          lastName: 'Davis',
          email: 'emily.davis@company.com',
          department: 'Engineering',
          position: 'Frontend Developer',
          salary: 78000,
          dateOfJoining: new Date('2021-09-20'),
          isActive: true,
        },
        {
          firstName: 'Robert',
          lastName: 'Wilson',
          email: 'robert.wilson@company.com',
          department: 'Finance',
          position: 'Senior Accountant',
          salary: 72000,
          dateOfJoining: new Date('2020-05-12'),
          isActive: false,
        },
      ]);

      console.log('✅ Sample employees seeded');
    }
  } catch (error) {
    console.error('❌ Seed error:', error.message);
  }
};

module.exports = seedData;
