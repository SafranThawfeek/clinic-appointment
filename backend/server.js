import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/authRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import patientRoutes from './routes/patientRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import chatRoutes from './routes/chat.routes.js';
import Message from './models/message.model.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Register API routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api', chatRoutes);

app.get('/', (req, res) => res.send('Clinic Appointment API Running'));

// Error handler (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/clinic';

// Connect to MongoDB and start server
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    const server = http.createServer(app);
    const io = new Server(server, {
      cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    // Keep a map of online users (socketId => user info)
    const onlineUsers = new Map();

    // Socket logic
    io.on('connection', (socket) => {
      console.log('Socket connected:', socket.id);

      socket.on('join', ({ chatId, userId, userName }) => {
        socket.join(chatId);
        onlineUsers.set(socket.id, { userId, userName, chatId });
        socket.to(chatId).emit('user-joined', { userId, userName });
      });

      socket.on('typing', ({ chatId, userId }) => {
        socket.to(chatId).emit('typing', { userId });
      });

      socket.on('message', async (payload) => {
        try {
          const msg = await Message.create({
            chatId: payload.chatId,
            senderId: payload.senderId,
            senderName: payload.senderName,
            text: payload.text,
            type: payload.type || 'text',
          });
          io.to(payload.chatId).emit('message', msg);
        } catch (err) {
          console.error('Error saving message:', err);
          socket.emit('error', { message: 'Message save failed' });
        }
      });

      socket.on('disconnect', () => {
        const info = onlineUsers.get(socket.id);
        if (info) {
          socket.to(info.chatId).emit('user-left', { userId: info.userId });
          onlineUsers.delete(socket.id);
        }
        console.log('Socket disconnected:', socket.id);
      });
    });

    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('MongoDB connection error', err);
  });
