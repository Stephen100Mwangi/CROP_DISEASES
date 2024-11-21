"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5620;
const io = new socket_io_1.Server(Number(PORT), {
    cors: {
        origin: "http://localhost:5173"
    }
});
io.on("connection", socket => {
    console.log("A user connected");
    socket.emit("message", "Welcome to CropGuard App - Chat Platform");
    socket.on("chatMessage", (message) => {
        console.log("Received message", message);
        socket.emit("message", message);
    });
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});
console.log(`Socket.IO server running on port ${PORT}`);
// const io = require('socket.io').(8900,{
//     cors:{
//         origin:"http://localhost:5173"
//     }
// });
// // After every connection
// io.on("connection",(_socket) => {
//     console.log("A user connected");
// })
