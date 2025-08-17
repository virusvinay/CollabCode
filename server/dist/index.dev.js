"use strict";

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var express = require("express");

var app = express();

var http = require("http");

var _require = require("socket.io"),
    Server = _require.Server;

var ACTIONS = require("./Actions");

var cors = require('cors');

var server = http.createServer(app);

var path = require('path'); // app.use(express.static(path.join(__dirname, 'client/build')));
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


var io = new Server(server, {
  path: "/socket.io",
  pingTimeout: 60000,
  cors: {
    origin: true,
    methods: ["GET", "POST"],
    credentials: false
  }
});
app.use(cors());
var userSocketMap = {};

var getAllConnectedClients = function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(function (socketId) {
    return {
      socketId: socketId,
      username: userSocketMap[socketId]
    };
  });
};

io.on("connection", function (socket) {
  console.log("Socket connected: ".concat(socket.id));
  socket.on(ACTIONS.JOIN, function (_ref) {
    var roomId = _ref.roomId,
        username = _ref.username;
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    var clients = getAllConnectedClients(roomId);
    console.log(clients); // notify that new user join

    clients.forEach(function (_ref2) {
      var socketId = _ref2.socketId;
      io.to(socketId).emit(ACTIONS.JOINED, {
        clients: clients,
        username: username,
        socketId: socket.id
      });
    });
  }); // socket.on(ACTIONS.CODE_OUTPUT, ({ roomId, output, error }) => {
  //   console.log("server",roomId, output, error)
  //   socket.to(roomId).emit(ACTIONS.CODE_OUTPUT, { output , error});
  // });

  socket.on("sendMessage", function (_ref3) {
    var roomId = _ref3.roomId,
        message = _ref3.message;
    console.log("message", message); // Broadcast the message to all clients in the room

    socket["in"](roomId).emit("receiveMessage", {
      message: message
    });
    socket["in"](roomId).emit("newMessageNotification", {
      roomId: roomId
    });
  });
  socket.on('sendApiData', function (_ref4) {
    var roomId = _ref4.roomId,
        output = _ref4.output,
        error = _ref4.error;
    console.log("kya bolo", roomId, output, error); // Broadcast the data to all connected clients
    //io.emit('apiData', output);

    socket["in"](roomId).emit('sendApiData', {
      output: output,
      error: error
    });
  }); // Handle the refresh notification
  // socket.on('USER_REFRESH', (roomId) => {
  //   socket.to(roomId).emit('REFRESH_BROWSER');
  // });
  // Handle language change

  socket.on(ACTIONS.LANGUAGE_CHANGE, function (_ref5) {
    var roomId = _ref5.roomId,
        language = _ref5.language;
    socket["in"](roomId).emit(ACTIONS.LANGUAGE_CHANGE, {
      language: language
    });
  }); //sync the code

  console.log("sync");
  socket.on(ACTIONS.CODE_CHANGE, function (_ref6) {
    var roomId = _ref6.roomId,
        code = _ref6.code;
    socket["in"](roomId).emit(ACTIONS.CODE_CHANGE, {
      code: code
    });
  }); // when new user join the room all the code which are there are also shows on that persons editor

  console.log("sync2");
  socket.on(ACTIONS.SYNC_CODE, function (_ref7) {
    var socketId = _ref7.socketId,
        code = _ref7.code;
    io.to(socketId).emit(ACTIONS.CODE_CHANGE, {
      code: code
    });
  }); // leave room

  socket.on("disconnecting", function () {
    var rooms = _toConsumableArray(socket.rooms); // leave all the room


    rooms.forEach(function (roomId) {
      socket["in"](roomId).emit(ACTIONS.DISCONNECTED, {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});
app.get("/", function (request, response) {
  return response.json({
    success: true,
    message: "Your Server is Up and Running Successfully !!........."
  });
});
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
  return console.log("Server is running on port ".concat(PORT));
});