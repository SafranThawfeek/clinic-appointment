import { io } from "socket.io-client";

// On backend utils file, read from process.env (Node) – support VITE_API_URL if set
const SERVER = (process.env.VITE_API_URL ? process.env.VITE_API_URL.replace('/api','') : (process.env.CLIENT_URL || 'http://localhost:5000'));

const socket = io(SERVER, {
  autoConnect: false,
});

export default socket;
