import React, { useState, useRef, useEffect } from "react";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useLocation } from "react-router-dom";
import { ImCross } from "react-icons/im";

export default function MessagingApp({ roomId, socketRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);

  const messageEndRef = useRef(null);
  const Location = useLocation();
  const username = Location?.state?.username || "DefaultUser";
  const inputRef = useRef(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setHasNewMessage(false);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message.message]);
        if (!isOpen) {
          setHasNewMessage(true);
        }
      });

      socketRef.current.on("newMessageNotification", () => {
        if (!isOpen) {
          setHasNewMessage(true);
        }
      });

      return () => {
        socketRef.current.off("receiveMessage");
        socketRef.current.off("newMessageNotification");
      };
    }
  }, [socketRef.current, isOpen]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      const messageToSend = `${username} : : ${inputValue}`;
      socketRef.current.emit("sendMessage", { roomId, message: messageToSend });
      setMessages([...messages, messageToSend]);
      setInputValue("");
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div>
      {/* Chat Toggle Button */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <Button
          onClick={toggleChat}
          className={`bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-full shadow-md hover:scale-105 transition ${
            hasNewMessage ? "ring-4 ring-blue-300" : ""
          }`}
        >
          {isOpen ? <ImCross /> : "💬 Chat"}
        </Button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-4 right-4 h-[65%] w-80 bg-gray-100 shadow-2xl border border-gray-200 rounded-2xl flex flex-col transform transition-all duration-300 z-50 ${
          isOpen ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-t-2xl shadow-md">
          <h2 className="text-sm font-semibold">💬 Live Chat</h2>
          <div
            className="cursor-pointer hover:scale-110 transition"
            onClick={toggleChat}
          >
            <ImCross size={14} />
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-grow p-3 bg-gray-50 rounded-b-2xl">
          <div className="space-y-2">
            {messages.map((message, index) => {
              const isOwn = message.startsWith(username);
              return (
                <div
                  key={index}
                  className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm shadow-sm ${
                    isOwn
                      ? "ml-auto bg-gradient-to-r from-blue-400 to-indigo-400 text-white rounded-br-none"
                      : "mr-auto bg-white text-gray-800 rounded-bl-none border border-gray-200"
                  }`}
                >
                  {message}
                </div>
              );
            })}
            <div ref={messageEndRef} />
          </div>
        </ScrollArea>

        {/* Input */}
        <form
          className="flex p-3 border-t border-gray-200 bg-white rounded-b-2xl"
          onSubmit={handleSendMessage}
        >
          <Input
            autoFocus
            placeholder="Type a message..."
            className="flex-grow mr-2 text-gray-700 text-sm border rounded-full px-3 py-2 focus:ring-2 focus:ring-blue-400"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button
            type="submit"
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium px-4 py-2 rounded-full text-sm hover:scale-105 transition"
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
