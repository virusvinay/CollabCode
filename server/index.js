const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const ACTIONS = require("./Actions");
const cors = require('cors');

const server = http.createServer(app);
const path = require('path');

// app.use(express.static(path.join(__dirname, 'client/build')));

// // The "catchall" handler: for any request that doesn't match one above, send back index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
// });
// const frontEndPath = path.resolve(__dirname, '../FrontEnd/dist');
// app.use(express.static(frontEndPath));

// // The "catchall" handler: for any request that doesn't match one above, send back index.html
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(frontEndPath, 'index.html'));
// });
// app.use(express.static(path.join(__dirname, '../FrontEnd/dist')));
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../FrontEnd/dist', 'index.html'));
// });
// console.log('Serving from:', path.join(__dirname, '../FrontEnd/dist'));
// console.log('Sending file:', path.resolve(__dirname, '../FrontEnd/dist', 'index.html'));

// const io = new Server(server, {
//   path : '/socket',
//   wssEngine : ['ws','wss'],
//   transports:['websocket','polling'],
//   cors:{
//     origin: "*"
//   },
//   allowEIO3:true,
// });

const io = new Server(server, {
 pingTimeout : 60000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  // Allow older versions of Socket.IO clients to connect
});


app.use(cors());

const userSocketMap = {};
const getAllConnectedClients = (roomId) => {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
    (socketId) => {
      return {
        socketId,
        username: userSocketMap[socketId],
      };
    }
  );
};





io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getAllConnectedClients(roomId);
    console.log(clients);
    // notify that new user join
    clients.forEach(({ socketId }) => {
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients,
        username,
        socketId: socket.id,
      });
    });
  });


   
  // socket.on(ACTIONS.CODE_OUTPUT, ({ roomId, output, error }) => {
  //   console.log("server",roomId, output, error)
  //   socket.to(roomId).emit(ACTIONS.CODE_OUTPUT, { output , error});
  // });


  socket.on("sendMessage", ({ roomId, message }) => {
    console.log("message" , message)
    // Broadcast the message to all clients in the room
    socket.in(roomId).emit("receiveMessage", {message});
    socket.in(roomId).emit("newMessageNotification", { roomId });
  });

  socket.on('sendApiData', ({roomId, output, error}) => {
    console.log("kya bolo" , roomId,output,error)
    // Broadcast the data to all connected clients
    //io.emit('apiData', output);
    socket.in(roomId).emit('sendApiData', {output,error});
  });
  // Handle the refresh notification
  // socket.on('USER_REFRESH', (roomId) => {
  //   socket.to(roomId).emit('REFRESH_BROWSER');
  // });

   // Handle language change
   socket.on(ACTIONS.LANGUAGE_CHANGE, ({ roomId, language }) => {
    socket.in(roomId).emit(ACTIONS.LANGUAGE_CHANGE, { language });
});
  //sync the code
  console.log("sync")
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code}) => {
    socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code});
  });
 // when new user join the room all the code which are there are also shows on that persons editor
 console.log("sync2")
  socket.on(ACTIONS.SYNC_CODE, ({ socketId, code}) => {
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code});
  });

  // leave room
  socket.on("disconnecting", () => {
    const rooms = [...socket.rooms];
    // leave all the room
    rooms.forEach((roomId) => {
      socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id],
      });
    });

    delete userSocketMap[socket.id];
    socket.leave();
  });
});
app.get("/", (request, response) => {
  return response.json({
    success : true,
    message : "Your Server is Up and Running Successfully !!........."
  })
  
})
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
