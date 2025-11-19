import express from "express";
import { getMessages, getRecentChats } from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/chats", getRecentChats);           // list chats (for left panel)
router.get("/chats/:chatId/messages", getMessages); // get messages for chat

export default router;
