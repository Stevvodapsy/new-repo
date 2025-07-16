import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Icon from "../components/Icon.jsx";
import {
  getOrCreateChatRoom,
  listenToMessages,
  sendMessage,
} from "../services/chatService.js";

const ChatBubble = ({ message, isUser }) => (
  <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
    <div
      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
        isUser
          ? "bg-indigo-600 text-white rounded-br-none"
          : "bg-gray-200 text-gray-800 rounded-bl-none"
      }`}
    >
      <p style={{ whiteSpace: "pre-wrap" }}>{message}</p>
    </div>
  </div>
);

const ChatScreen = ({ chatPartner, goBack }) => {
  const currentUser = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [roomId, setRoomId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const unsubscribeRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // If user or partner is missing, show error and enable input
    if (!currentUser?.id || !chatPartner?.id) {
      setError("Unable to start chat: missing user information.");
      setIsLoading(false);
      return;
    }
    async function initChat() {
      setError(null);
      setIsLoading(true);
      try {
        const room = await getOrCreateChatRoom(currentUser.id, chatPartner.id);
        setRoomId(room.id);
        // Listen to messages
        unsubscribeRef.current = listenToMessages(room.id, (msgs) => {
          setMessages(
            msgs.map((msg) => ({
              text: msg.text,
              isUser: msg.senderId === currentUser.id,
              createdAt: msg.createdAt,
            }))
          );
        });
      } catch (err) {
        setError("Failed to start chat. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }
    initChat();
    return () => {
      if (unsubscribeRef.current) unsubscribeRef.current();
    };
  }, [currentUser, chatPartner]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !roomId) return;
    setIsLoading(true);
    setError(null);
    try {
      await sendMessage(roomId, currentUser.id, input.trim());
      setInput("");
    } catch (err) {
      setError("Failed to send message. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      <header className="flex items-center p-4 border-b bg-white sticky top-0 z-10 shrink-0">
        <button
          onClick={goBack}
          className="mr-4 p-1 rounded-full hover:bg-gray-100"
        >
          <Icon name="arrowLeft" className="w-6 h-6 text-gray-700" />
        </button>
        <img
          src={
            chatPartner.photo ||
            chatPartner.avatar ||
            "https://i.pravatar.cc/100"
          }
          alt={chatPartner.name}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <h2 className="font-bold text-gray-800">{chatPartner.name}</h2>
          <p className="text-sm text-gray-500">Online</p>
        </div>
      </header>

      <main className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} message={msg.text} isUser={msg.isUser} />
        ))}
        <div ref={messagesEndRef} />
      </main>

      <footer className="p-4 border-t bg-white sticky bottom-0 shrink-0">
        {error && (
          <p className="text-red-500 text-xs text-center mb-2">{error}</p>
        )}
        <form onSubmit={handleSend} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="ml-3 bg-indigo-600 text-white p-3 rounded-full disabled:bg-indigo-300 transition-colors"
          >
            <Icon name="send" className="w-6 h-6" />
          </button>
        </form>
      </footer>
    </div>
  );
};

// Accept chatPartner as prop, fallback to default for direct /chat route
const ChatBox = ({ chatPartner, goBack }) => {
  const defaultAgent = {
    id: "agent-demo-id",
    name: "Agent Smith",
    avatar: "https://i.pravatar.cc/100?img=12",
  };
  return (
    <ChatScreen
      chatPartner={chatPartner || defaultAgent}
      goBack={goBack || (() => window.history.back())}
    />
  );
};

export default ChatBox;
