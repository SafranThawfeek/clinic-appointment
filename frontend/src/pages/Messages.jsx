import React, { useState } from "react";
import ChatList from "../components/messages/ChatList";
import ChatWindow from "../components/messages/ChatWindow";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function Messages() {
  const [selectedChat, setSelectedChat] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* fixed sidebar */}
      <Sidebar />

      {/* main content area (account for sidebar width) */}
      <div className="ml-64 p-6">
        <Topbar />

        <h2 className="text-2xl font-semibold mb-4">Chat</h2>

        <div className="bg-white rounded-xl shadow flex h-[80vh] overflow-hidden">
          {/* LEFT: Chat List */}
          <div className="w-96 border-r">
            <ChatList onSelect={setSelectedChat} selectedChat={selectedChat} />
          </div>

          {/* RIGHT: Chat Window */}
          <div className="flex-1">
            {selectedChat ? (
              <ChatWindow chat={selectedChat} />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Select a conversation to start chatting
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
