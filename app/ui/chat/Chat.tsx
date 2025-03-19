"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import useWebSocket from "@/app/ui/chat/useWebSocket";

export default function Chat() {
  const { messages, sendMessage } = useWebSocket();
  const [message, setMessage] = useState("");

  useEffect(() => {
    console.log("Updated Messages:", messages);
  }, [messages]);

  const handleSend = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-3 w-full bg-white rounded-t-lg rounded-bl-lg z-50">
      <h2 className="text-md font-semibold mb-2 text-center  text-blue-900"> Chat Room</h2>
      <div className="h-48 overflow-y-auto border p-2 mb-2 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className="flex items-center space-x-2 bg-blue-300 rounded-lg w-fit px-2 py-1 bg-opacity-20">
              <Image 
                src={msg.profileImageUrl.startsWith("http") ? msg.profileImageUrl : `${process.env.NEXT_PUBLIC_API_URL}${msg.profileImageUrl}`}
                alt={msg.senderName || "Unknown"} 
                width={24} 
                height={24} 
                className="rounded-full object-cover" 
                unoptimized 
              />
              <p className="text-sm  text-blue-900">
                <strong>{msg.senderName || "Unknown"}:</strong> {msg.content}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet.</p>
        )}
      </div>
      <div className="flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-grow p-2 border rounded-l-lg text-sm"
          placeholder="Type a message..."
        />
        <button 
          onClick={handleSend} 
          className="bg-blue-500 text-white px-3 py-2 rounded-r-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
}
