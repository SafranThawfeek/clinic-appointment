import 'dotenv/config.js';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); //
    const email = 'admin@clinic.com';
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Admin already exists:', existing.email);
      process.exit(0);
    }
    const hashed = await bcrypt.hash('Admin@123', 10); //
    const admin = await User.create({ //
      name: 'Admin User',
      email,
      password: hashed,
      role: 'admin'
    });
    console.log('Admin created:', admin.email);
    process.exit(0); //
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
