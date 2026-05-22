import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await connectDB();

    const adminExists = await User.findOne({ email: 'admin@newbeginnings.com' });

    if (adminExists) {
      console.log('Admin user already exists!');
      process.exit();
    }

    const admin = await User.create({
      name: 'System Admin',
      username: 'admin',
      email: 'admin@newbeginnings.com',
      password: 'password123',
      mobile: '9999999999',
      gender: 'Other',
      age: 30,
      city: 'Admin City',
      role: 'admin'
    });

    console.log(`Admin user seeded successfully!`);
    console.log(`Email: ${admin.email}`);
    console.log(`Password: password123`);
    
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();
