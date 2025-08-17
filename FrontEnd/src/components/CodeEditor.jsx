import { useRef, useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import Home from "./Home";
import Client from "./Client";
import { MdMessage } from "react-icons/md";
import MessageModal from "./MessageModal";
import { ACTIONS } from "../Actions";
import { useNavigate, useLocation, Navigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import Ide from "./Ide";
import { initSocket } from "../Socket";

const CodeEditor = () => {
  const socketRef = useRef(null);
  const codeRef = useRef(null);
  const Location = useLocation();
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isFirstConnection, setIsFirstConnection] = useState(true);
  const [value, setValue] = useState("");
  const [language, setLanguage] = useState("javascript");
  const editorRef = useRef();

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.on("connect_error", handleErrors);
      socketRef.current.on("connect_failed", handleErrors);

      socketRef.current.emit("join", {
        roomId,
        username: Location.state?.username,
      });

      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (isFirstConnection) {
          if (username !== Location.state?.username) {
            toast.success(`${username} joined the room.`);
          }
          setIsFirstConnection(false);
        }
        setClients(clients);
        socketRef.current.emit(ACTIONS.SYNC_CODE, {
          code: codeRef.current,
          socketId,
        });
      });

      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`);
        setClients((prev) =>
          prev.filter((client) => client.socketId !== socketId)
        );
      });
    };
    init();

    return () => {
      socketRef.current && socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    };
  }, [codeRef.current]);

  if (!Location.state) {
    return <Navigate to="/" />;
  }

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (language) => {
    setLanguage(language);
    setValue(CODE_SNIPPETS[language]);
  };

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID copied to clipboard");
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the Room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-slate-900 text-slate-100">
      {/* Sidebar */}
      <div className="w-full lg:w-1/5 p-4">
        <div className="bg-slate-950 rounded-lg shadow-inner flex flex-col h-full p-4 border border-slate-800">
          <h2 className="text-lg font-semibold text-center mb-4 text-gray-300">
            Members
          </h2>

          {/* Member list */}
          <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scroll">
            {clients.map((client) => (
              <Client
                key={client.socketId}
                username={client.username}
                Location={Location}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button
              onClick={copyRoomId}
              className="w-full py-2 bg-gray-600 text-white rounded-md font-medium hover:bg-gray-500 transition"
            >
              Copy Room ID
            </button>

            <button
              onClick={leaveRoom}
              className="w-full py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-500 transition"
            >
              Leave Room
            </button>

            {/* Chat button aligned with Leave Room */}
            <MessageModal roomId={roomId} socketRef={socketRef}>
              <button className="w-full py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-500 transition flex items-center justify-center gap-2">
                <MdMessage className="text-lg" />
                Chat
              </button>
            </MessageModal>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-4 overflow-hidden">
        <div className="bg-slate-800 border border-slate-700 rounded-lg shadow-inner flex-1 flex flex-col overflow-hidden">
          <Ide
            socketRef={socketRef}
            roomId={roomId}
            onCodeChange={(code) => {
              codeRef.current = code;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
