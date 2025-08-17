// import { useRef, useState } from "react";
// import { Box, HStack } from "@chakra-ui/react";
// import { Editor } from "@monaco-editor/react";
// import LanguageSelector from "./LanguageSelector";
// import { CODE_SNIPPETS } from "../constants";
// import Output from "./Output";
// import { parseTmTheme } from "monaco-themes";
// import Home from "./Home";
// import Client from "./Client";
// import React, { useEffect } from "react";
// // import Client from "./Client";
// // import Editor from "./Editor";
// // import { initSocket } from "../Socket";
// // import { ACTIONS } from "../Actions";
// import { MdMessage } from "react-icons/md";
// import MessageModal from "./MessageModal";
// import {ACTIONS} from "../Actions" 
// import {
//   useNavigate,
//   useLocation,
//   Navigate,
//   useParams,
// } from "react-router-dom";
// import { toast } from "react-hot-toast";
// import Ide from "./Ide";
// import { initSocket } from "../socket";

// const CodeEditor = () => {

//   const socketRef = useRef(null);
//   const codeRef = useRef(null);
//   const Location = useLocation();
//   const {roomId} = useParams();
//   const navigate = useNavigate()
//   const [clients, setClients] = useState([]);
//   const [isFirstConnection, setIsFirstConnection] = useState(true);
//   useEffect(() => {
   
//     const init = async() => {

    
//       socketRef.current = await initSocket();
//      // console.log("editor wala" , socketRef.current.emit)
//       socketRef.current.on("connect_error", (err) => handleErrors(err));
//       socketRef.current.on("connect_failed", (err) => handleErrors(err));

//       const handleErrors = (err) => {
//         console.log("Error", err);
//         toast.error("Socket connection failed, Try again later");
//         navigate("/");
//       };


//       socketRef.current.emit('join' , {
//         roomId,
//         username: Location.state?.username
//       })

//       socketRef.current.on(
//         ACTIONS.JOINED,
//         ({ clients, username, socketId }) => {
//           // this insure that new user connected message do not display to that user itself
//           if(isFirstConnection){
//           if (username !== Location.state?.username) {
//             toast.success(`${username} joined the room.`);
//           }
//        setIsFirstConnection(false)
//         }
//           setClients(clients);
//           // also send the code to sync
//           socketRef.current.emit(ACTIONS.SYNC_CODE, {
//             code: codeRef.current,
//             socketId,
//           });
//         }
//       );
//    // listening for disconnected
//    socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
//     toast.success(`${username} left the room`);
//     setClients((prev) => {
//       return prev.filter((client) => client.socketId !== socketId);
//     });
//   });

//     }
//     init();


//      // cleanup
//      return () => {
//       socketRef.current && socketRef.current.disconnect();
//       socketRef.current.off(ACTIONS.JOINED);
//       socketRef.current.off(ACTIONS.DISCONNECTED);
//     };
//   }, [codeRef.current])
 
//   if(!Location.state){
//     return <Navigate to = "/"></Navigate>
//   }
//   const editorRef = useRef();
//   const [value, setValue] = useState("");
//   const [language, setLanguage] = useState("javascript");

//   const onMount = (editor) => {
//     editorRef.current = editor;
//     editor.focus();
//   };

//   const onSelect = (language) => {
//     setLanguage(language);
//     setValue(CODE_SNIPPETS[language]);
//   };

//   const copyRoomId = async () => {
//     try {
//       await navigator.clipboard.writeText(roomId);
//       toast.success(`roomId is copied`);
//     } catch (error) {
//       console.log(error);
//       toast.error("unable to copy the room Id");
//     }
//   };

//   const leaveRoom = async () => {
//     navigate("/");
//   };

//   return (
//     <>
//       <div className="container-fluid vh-100">
//         <div className="row h-100">
//           <div
   
//             className="col-md-2 bg-dark text-light d-flex flex-column h-100 rounded border"
//             style={{ boxShadow: "2px 0px 4px rgba(0, 0, 0, 0.1)"}}
//           >
//             {/* <img
//               src=""
//              // alt="Logo"
//               className="img-fluid mx-auto"
//               style={{ maxWidth: "150px", marginTop: "-43px" }}
//             /> */}
//             {/* <hr style={{ marginTop: "-3rem" }} /> */}
//             {/* <hr />
//             <hr></hr> */}
//             <div className="d-flex flex-column flex-grow-1 overflow-auto">
//               <span className="mb-4 text-center mt-4 font-bold text-lg ">Members</span>
//               {clients.map((client) => (
//                 <Client key={client.socketId} username={client.username} />
//               ))}
             
//             </div>

//             {/* Buttons */}
//             <div className = "flex justify-center items-center ">
//             <div className="mt-auto ">
//               <hr />
//               <button className="btn btn-success mt-2" onClick={copyRoomId}>Copy Roomid</button>
//               <button
//                 className="btn btn-danger mt-2 mb-2 px-3 btn-block"
//                  onClick={leaveRoom}
//               >
//                 Leave Room
//               </button>
//             </div>
//             {/* <div className="cursor-pointer text-blue-500 hover:text-blue-700 text-2xl p-2 rounded-lg border border-gray-300 hover:border-gray-500 transition-all duration-300">
//             <MdMessage />
//             </div> */}

//             <MessageModal roomId = {roomId} socketRef = {socketRef}></MessageModal>

//             </div>
//           </div>

//           <div className="col-md-10 text-light d-flex flex-column h-100 ">
//             <Ide  socketRef={socketRef}
//             roomId={roomId}  onCodeChange={(code) => {
//               codeRef.current = code;
//             }}></Ide>
//           </div>
//         </div>
//       </div>

//       {/* ----------------------------------------------- */}
//       {/* <Box>
//         <HStack spacing={4}>
//           <Box w="40%">
//             <LanguageSelector language={language} onSelect={onSelect} />
//             <Editor
//               options={{
//                 minimap: {
//                   enabled: false,
//                 },
//               }}
//               height="75vh"
//               theme="vs-dark"
//               language={language}
//               defaultValue={CODE_SNIPPETS[language]}
//               onMount={onMount}
//               value={value}
//               onChange={(value) => setValue(value)}
//             />
//           </Box>
//           <Output editorRef={editorRef} language={language} h="auto" />
//         </HStack>
//       </Box> */}
//     </>
//   );
// };
// export default CodeEditor;






import { useRef, useState, useEffect } from "react";
import { Box, HStack } from "@chakra-ui/react";
import { Editor } from "@monaco-editor/react";
import LanguageSelector from "./LanguageSelector";
import { CODE_SNIPPETS } from "../constants";
import Output from "./Output";
import { parseTmTheme } from "monaco-themes";
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

      socketRef.current.on("connect_error", (err) => handleErrors(err));
      socketRef.current.on("connect_failed", (err) => handleErrors(err));

      const handleErrors = (err) => {
        console.log("Error", err);
        toast.error("Socket connection failed, Try again later");
        navigate("/");
      };

      socketRef.current.emit('join', {
        roomId,
        username: Location.state?.username
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
        setClients((prev) => prev.filter((client) => client.socketId !== socketId));
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
      toast.success(`Room ID copied to clipboard`);
    } catch (error) {
      console.log(error);
      toast.error("Unable to copy the Room ID");
    }
  };

  const leaveRoom = async () => {
    navigate("/");
  };

  return (
    <div className="flex sm:items-start  items-center flex-col lg:flex-row h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <div className="w-[80%]  lg:w-1/4 bg-gray-800 text-white flex flex-col p-4 rounded-lg border border-gray-700 sm:border-r lg:border-gray-700 shadow-lg mb-4 lg:mb-0 lg:mr-2 lg:ml-0 ">
        <div className="flex-grow overflow-auto">
          <h2 className="text-xl font-semibold mb-4 text-center">Members</h2>
          {clients.map((client) => (
            <Client key={client.socketId} username={client.username} Location = {Location} />
          ))}
        </div>
        <div className="mt-4 flex flex-col space-y-2">
          <button
            onClick={copyRoomId}
            className="w-full py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors border border-teal-600"
          >
            Copy Room ID
          </button>
          <button
            onClick={leaveRoom}
            className="w-full py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors border border-red-700"
          >
            Leave Room
          </button>
          <div className="flex justify-center">
            <MessageModal roomId={roomId} socketRef={socketRef}>
              <MdMessage
                className="text-blue-400 text-3xl cursor-pointer hover:text-blue-500 transition-colors"
                title="Send a message"
              />
            </MessageModal>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:w-3/4 flex flex-col p-4  rounded-lg border border-gray-700 shadow-lg">
        <Ide
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;
