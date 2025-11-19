import 'dotenv/config.js';
import mongoose from 'mongoose';
import User from './models/User.js';

async function run() {
  const email = process.argv[2] || process.env.PROMOTE_EMAIL;
  if (!email) {
    console.error('Usage: node promoteUser.js user@example.com');
    process.exit(1); //
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }); //
    const user = await User.findOne({ email }); //
    if (!user) {
      console.error('User not found:', email);
      process.exit(1); //
    }
    user.role = 'admin';
    await user.save();
    console.log('User promoted to admin:', email);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
