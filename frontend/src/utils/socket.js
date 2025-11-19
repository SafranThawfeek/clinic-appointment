import { io } from "socket.io-client";
import { getApiBase } from "./env";

const SERVER = getApiBase().replace('/api', '');

const socket = io(SERVER, {
  autoConnect: false,
});

export default socket;
