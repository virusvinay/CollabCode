

import React, { useState, useRef, useEffect } from "react";
import { MdMessage } from "react-icons/md";
import { Button } from "./../components/ui/button";
import { Input } from "./../components/ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { useLocation } from "react-router-dom";
import { ImCross } from "react-icons/im";

export default function MessagingApp({ roomId, socketRef }) {
  const [modal, setModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const messageEndRef = useRef(null);
  const Location = useLocation();
  const username = Location?.state?.username || "DefaultUser"; // Set default username
  const inputRef = useRef(null);
  const modalHandler = () => {
    setModal(!modal);
    // Reset the notification when modal is opened
    if (modal) {
      setHasNewMessage(false);
    }
  };



  useEffect(() => {
    // Focus the input field when the component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.on("receiveMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message.message]);
        // Set notification flag
        if (!modal) {
          setHasNewMessage(true);
        }
      });

      socketRef.current.on("newMessageNotification", () => {
        if (!modal) {
          setHasNewMessage(true);
        }
      });

      return () => {
        socketRef.current.off("receiveMessage");
        socketRef.current.off("newMessageNotification");
      };
    }
  }, [socketRef.current, modal]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Prepend username to the message
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
    <div >
      <div
        className={`cursor-pointer text-white text-2xl p-3 rounded-full border border-blue-700 bg-blue-700 hover:bg-blue-800 transition-all duration-300 relative ${hasNewMessage ? 'ring-2 ring-blue-300' : ''}`}
        onClick={modalHandler}
      >
        <MdMessage className="text-white" />
        {hasNewMessage && (
          <div className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 py-0.5 rounded-full animate-pulse-new">
            New
          </div>
        )}
      </div>
      {modal && (
        <div className="fixed inset-0  flex items-center bg-red-500  bg-opacity-10 backdrop-blur-none  z-50">
          <div className="relative flex flex-col h-screen p-4 bg-blue-700 border border-gray-300 rounded-lg">
            {/* Close Button */}
            <div
              className="absolute top-4 right-4 text-red-500 text-3xl cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-110"
              onClick={modalHandler}
            >
              <ImCross />
            </div>

            {/* Scrollable Fixed Size Div for Messages */}
            <ScrollArea className="flex-grow p-4 overflow-y-auto ">
              <div className="space-y-2">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className="bg-white p-2 shadow-lg rounded-lg text-black  font-semibold  "
                  >
                    {message}
                  </div>
                ))}
                <div ref={messageEndRef} />
              </div>
            </ScrollArea>

            {/* Input for Messaging */}
            <form className="flex mt-4" onSubmit={handleSendMessage}>
              <Input
                   autoFocus
                placeholder="Type your message here"
                className="flex-grow mr-2 text-black"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="submit"  className=" bg-yellow-500 text-black font-semibold hover:text-white ">Send</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
