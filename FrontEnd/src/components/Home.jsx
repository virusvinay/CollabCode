import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AccordianBar from "./AccordianBar";
import Navbar from "../components/Navbar";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room ID generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    navigate(`/editor/${roomId}`, {
      state: { username },
    });
    toast.success("Joined room");
  };

  const handleInputEnter = (e) => {
    if (e.code === "Enter") joinRoom();
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      
      <div className="max-w-6xl mx-auto p-6 lg:p-12 flex flex-col lg:flex-row gap-8">
        {/* Left card - Join / Create */}
        <div className="flex-1 bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-700">
          <div className="text-center mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-teal-300 bg-clip-text text-transparent">
              CollabCode
            </h1>
            <p className="text-gray-400 mt-2">Realtime Collaboration Editor</p>
          </div>

          <div className="space-y-4">
            <label className="text-sm text-gray-300">ROOM ID</label>
            <input
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              onKeyUp={handleInputEnter}
              placeholder="Paste or generate room id"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <label className="text-sm text-gray-300">USERNAME</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyUp={handleInputEnter}
              placeholder="Your display name"
              className="w-full p-3 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={joinRoom}
                className="flex-1 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
              >
                Join
              </button>
              <button
                onClick={generateRoomId}
                className="px-4 py-3 bg-transparent border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-800"
              >
                New Room
              </button>
            </div>

            <p className="text-xs text-gray-400 mt-3">
              Tip: Share the Room ID with collaborators to join together.
            </p>
          </div>
        </div>

        {/* Right card - FAQ */}
        <div className="w-full lg:w-1/2">
          <AccordianBar />
        </div>
      </div>
    </div>
  );
}

export default Home;
