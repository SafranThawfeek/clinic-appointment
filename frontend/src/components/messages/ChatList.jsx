import React, { useEffect, useState } from "react";
import axios from "axios";
import { Search, MoreHorizontal } from "lucide-react";
import Avatar from "../Avatar";
import { getApiBase } from "../../utils/env";

export default function ChatList({ onSelect, selectedChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const load = async () => {
      const base = getApiBase();
      const res = await axios.get(`${base}/api/chats`);
      setChats(res.data); // server returns last message per chat
    };
    load();
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* header */}
      <div className="p-4 border-b flex items-center gap-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 w-full">
          <Search className="w-4 h-4 text-gray-500" />
          <input
            type="text"
            className="bg-transparent outline-none w-full text-sm"
            placeholder="Search..."
          />
        </div>
        <button className="p-2 rounded-full hover:bg-gray-100">
          <MoreHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {chats.length === 0 && (
          <div className="p-6 text-center text-gray-400">No conversations yet</div>
        )}

        {chats.map((c) => (
          <div
            key={c.chatId}
            onClick={() => onSelect({ chatId: c.chatId, name: c.senderName || 'Conversation' })}
            className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b hover:bg-gray-50 ${selectedChat?.chatId === c.chatId ? "bg-blue-50" : ""}`}
          >
            <div className="relative">
              <Avatar src={c.senderImage} name={c.senderName} size={48} className="border" />
              {/* unread dot example */}
              <span className="absolute -right-0 -bottom-0 w-3 h-3 rounded-full bg-blue-500 ring-2 ring-white" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="font-medium truncate">{c.senderName || 'Unknown'}</div>
                <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
              <div className="text-xs text-gray-500 truncate mt-1">{c.text || c.lastMsg?.text || ''}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
