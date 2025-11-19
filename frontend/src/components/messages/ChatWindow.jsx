import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../utils/socket";
import { getApiBase } from "../../utils/env";
import { MoreVertical, Phone, Paperclip } from "lucide-react";
import Avatar from "../Avatar";

export default function ChatWindow({ chat }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState(null);
  const messagesRef = useRef(null);

  // current user info (replace with your auth user)
  const currentUser = { userId: "admin-1", userName: "Clinic Admin" };

  useEffect(() => {
    if (!chat) return;

    const chatId = chat.chatId || chat.chatId; // ensure property name

    // connect socket if not connected
    if (!socket.connected) socket.connect();

    // join room
    socket.emit("join", { chatId, userId: currentUser.userId, userName: currentUser.userName });

    // load message history via REST
    const loadHistory = async () => {
      const base = getApiBase();
      const res = await axios.get(`${base}/api/chats/${chatId}/messages`);
      setMessages(res.data);
      scrollToBottom();
    };
    loadHistory();

    // listen for new messages (server will emit 'message' to room)
    const onMessage = (msg) => {
      if (msg.chatId === chatId) {
        setMessages((prev) => [...prev, msg]);
        scrollToBottom();
      }
    };

    const onTyping = ({ userId }) => {
      if (userId !== currentUser.userId) {
        setTypingUser(userId);
        // clear indicator after few seconds
        setTimeout(()=>setTypingUser(null), 2000);
      }
    };

    socket.on("message", onMessage);
    socket.on("typing", onTyping);

    return () => {
      socket.off("message", onMessage);
      socket.off("typing", onTyping);
      // optionally leave room (socket.leave not directly called from client via socket.io-client)
      // socket.emit('leave', { chatId }); // implement if needed
    };
    // eslint-disable-next-line
  }, [chat]);

  const sendMessage = () => {
    if (!text.trim()) return;
    const payload = {
      chatId: chat.chatId,
      senderId: currentUser.userId,
      senderName: currentUser.userName,
      text: text.trim(),
      type: "text",
    };
    // optimistic UI add (optional)
    setMessages((prev) => [...prev, { ...payload, createdAt: new Date().toISOString() }]);
    scrollToBottom();
    setText("");
    // emit to server — server will save and broadcast
    socket.emit("message", payload);
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    // broadcast typing
    socket.emit("typing", { chatId: chat.chatId, userId: currentUser.userId });
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
    }, 50);
  };

  if (!chat) return <div className="h-full flex items-center justify-center text-gray-400">Select a conversation</div>;

  return (
    <div className="h-full flex flex-col">
      {/* header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar src={chat.image} name={chat.name || chat.chatId} size={40} className="border" />
          <div>
            <div className="font-medium">{chat.name || chat.chatId}</div>
            <div className="text-xs text-gray-500">{typingUser ? "Typing..." : "Last seen 07:15 PM"}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100"><Phone className="w-4 h-4 text-gray-600" /></button>
          <button className="p-2 rounded-full hover:bg-gray-100"><MoreVertical className="w-4 h-4 text-gray-600" /></button>
        </div>
      </div>

      {/* messages area */}
      <div ref={messagesRef} className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-50">
        {messages.map((m, idx) => {
          const isMine = m.senderId === currentUser.userId;
          return (
            <div key={m._id || idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
              <div className={`flex items-end ${isMine ? "justify-end" : "justify-start"} gap-2`}> 
                {!isMine && (
                  <Avatar src={m.senderImage} name={m.senderName} size={32} />
                )}

                <div className={`${isMine ? "bg-purple-600 text-white" : "bg-white text-gray-700 border"} max-w-[75%] p-3 rounded-xl shadow`}> 
                  <div className="text-sm">{m.text}</div>
                  <div className="text-xs text-right mt-1 opacity-70">{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* input */}
      <div className="p-4 border-t flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100"><Paperclip className="w-5 h-5 text-gray-500" /></button>
        <input value={text} onChange={handleTyping} className="flex-1 border rounded-xl px-4 py-2 text-sm" placeholder="Type your message here..." />
        <button onClick={sendMessage} className="bg-purple-600 text-white px-4 py-2 rounded-xl">Send</button>
      </div>
    </div>
  );
}
