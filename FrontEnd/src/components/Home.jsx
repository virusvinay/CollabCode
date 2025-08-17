// import React, { useState } from "react";
// import { v4 as uuid } from "uuid";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import AccordianBar from "./AccordianBar";
// function Home() {
//   const [roomId, setRoomId] = useState("");
//   const [username, setUsername] = useState("");

//   const navigate = useNavigate();

//   const generateRoomId = (e) => {
//     e.preventDefault();
//     const Id = uuid();
//     setRoomId(Id);
//     toast.success("Room Id is generated");
//   };

//   const joinRoom = () => {
//     if (!roomId || !username) {
//       toast.error("Both the field is requried");
//       return;
//     }

//     // redirect
//     navigate(`/editor/${roomId}`, {
//       state: {
//         username,
//       },
//     });
//     toast.success("room is created");
//   };

//   // when enter then also join
//   const handleInputEnter = (e) => {
//     if (e.code === "Enter") {
//       joinRoom();
//     }
//   };

//   return (
//     <div className="container-fluid" >
//       <div className="row justify-content-center align-items-center min-vh-100">
//         <div className="col-12 col-md-6">
//           <div className="card shadow-sm p-2 mb-5 bg-secondary rounded">
//             <div className="card-body text-center ">
//               <img
//                 src="/codeCollabLogo.png"
//                 alt="Logo"
//                 className="img-fluid mx-auto d-block"
//                 style={{ maxWidth: "200px" }}
//               />
//               <h4 className="card-title text-light mb-4">Enter the ROOM ID</h4>

//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={roomId}
//                   onChange={(e) => setRoomId(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="ROOM ID"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <div className="form-group">
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="form-control mb-2"
//                   placeholder="USERNAME"
//                   onKeyUp={handleInputEnter}
//                 />
//               </div>
//               <button
//                 onClick={joinRoom}
//                 className=" text-#0e161b btn btn-success btn-lg btn-block"
//               >
//                 JOIN
//               </button>
//               <p className="mt-3 text-light">
//                 Don't have a room ID? Click
//                 <span
//                   onClick={generateRoomId}
//                   className=" text-info p-2 font-weight-bold"
//                   style={{ cursor: "pointer" }}
//                 >
                  
//                   New Room
//                 </span>
//               </p>
//             </div>
//           </div>
//         </div>

//         <AccordianBar></AccordianBar>
//       </div>
//     </div>
//   );
// }

// export default Home;

import React, { useState } from "react";
import { v4 as uuid } from "uuid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AccordianBar from "./AccordianBar";

function Home() {
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const navigate = useNavigate();

  const generateRoomId = (e) => {
    e.preventDefault();
    const Id = uuid();
    setRoomId(Id);
    toast.success("Room ID is generated");
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error("Both fields are required");
      return;
    }

    // redirect
    navigate(`/editor/${roomId}`, {
      state: {
        username,
      },
    });
    toast.success("Room is joined");
  };

  // when enter then also join
  const handleInputEnter = (e) => {
    if (e.code === "Enter") {
      joinRoom();
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row items-center justify-center bg-gray-900 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md bg-gray-800 shadow-lg rounded-lg p-6 sm:p-8 mb-8 lg:mb-0 lg:mr-8">
        <div className="text-center">
          <img
            src="/codeCollabLogo.png"
            alt="Logo"
            className="mx-auto mb-4   sm:max-w-[150px] md:max-w-[200px] lg:max-w-[300px]"
            
          />
          <h4 className="text-xl sm:text-2xl font-semibold text-gray-100 mb-4">
            Enter the ROOM ID
          </h4>

          <div className="mb-4">
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full p-3 border border-gray-700 bg-gray-900 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ROOM ID"
              onKeyUp={handleInputEnter}
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border border-gray-700 bg-gray-900 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="USERNAME"
              onKeyUp={handleInputEnter}
            />
          </div>
          <button
            onClick={joinRoom}
            className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-300"
          >
            JOIN
          </button>
          <p className="mt-4 text-gray-400">
            Don't have a room ID? Click{" "}
            <span
              onClick={generateRoomId}
              className="text-blue-400 font-semibold cursor-pointer"
            >
              New Room
            </span>
          </p>
        </div>
      </div>

      <AccordianBar className="w-full max-w-md" />
    </div>
  );
}

export default Home;
