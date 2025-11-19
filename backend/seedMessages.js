import mongoose from 'mongoose';
import Message from './models/message.model.js';
import 'dotenv/config';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinic';

async function seed() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB for seeding messages');

  // Clear existing messages (optional)
  await Message.deleteMany({});

  const now = new Date();
  const msgs = [
    { chatId: 'chat1', senderId: 'user1', senderName: 'Ravindu', text: 'Hello Doctor, I\'m feeling unwell.', createdAt: new Date(now.getTime() - 1000 * 60 * 60) },
    { chatId: 'chat1', senderId: 'doctor1', senderName: 'Dr. Keene', text: 'Hi, can you share your recent readings?', createdAt: new Date(now.getTime() - 1000 * 60 * 50) },
    { chatId: 'chat1', senderId: 'user1', senderName: 'Ravindu', text: 'My blood pressure was 140/90', createdAt: new Date(now.getTime() - 1000 * 60 * 45) },

    { chatId: 'chat2', senderId: 'user2', senderName: 'Hirusha', text: 'Do you have an appointment available?', createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24) },
    { chatId: 'chat2', senderId: 'doctor1', senderName: 'Dr. Keene', text: 'Yes, tomorrow at 10 AM.', createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 + 1000 * 60 * 5) },
  ];

  await Message.insertMany(msgs);
  console.log('Inserted sample messages');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed', err);
  process.exit(1);
});
