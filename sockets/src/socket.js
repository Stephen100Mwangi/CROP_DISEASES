"use strict";
// const io = require('socket.io')(4580,{
//     cors :{
//         origin: "http://localhost:5173"
//     }
// })
Object.defineProperty(exports, "__esModule", { value: true });
// interface User{
//     userId: string,
//     socketId:string
// }
// let activeUsers = [];
// // Start the socket server
// io.on("connection", (socket)=>{
//     // Add new user
//     socket.on("newUser",(newUserId) => {
//         // Check if user already exists in the activeUsers array
//         if (!activeUsers.some((user)=> user.userId === newUserId)) {
//             activeUsers.push({
//                 userId: newUserId,
//                 socketId:socket.id
//             })
//         }
//         // Send active users to the client side
//         console.log("New connection established",activeUsers);
//         io.emit("getUsers",activeUsers)
//     })
//     // Once the usr is disconnected they are removed from  active users array
//     socket.on("disconnect",()=>{
//         activeUsers = activeUsers.filter((user)=> user.socketId !== socket.id)
//         console.log("User disconnected", activeUsers);
//     })
// })
const socket_io_1 = require("socket.io");
const http_1 = require("http");
// Create HTTP server and Socket.IO instance
const httpServer = (0, http_1.createServer)();
const io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000, // 1 minute timeout
});
// Store active users
let activeUsers = [];
// Helper functions
const addUser = (userId, socketId) => {
    if (!activeUsers.some(user => user.userId === userId)) {
        activeUsers.push({ userId, socketId });
    }
};
const removeUser = (socketId) => {
    activeUsers = activeUsers.filter(user => user.socketId !== socketId);
};
// Socket connection handler
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);
    // Handle new user joining
    socket.on("newUser", (userId) => {
        try {
            if (!userId) {
                throw new Error("UserId is required");
            }
            addUser(userId, socket.id);
            console.log("Active users after new connection:", activeUsers);
            // Broadcast updated user list to all connected clients
            io.emit("getUsers", activeUsers);
        }
        catch (error) {
            console.error("Error handling new user:", error);
            socket.disconnect();
        }
    });
    // Handle disconnection
    socket.on("disconnect", () => {
        try {
            console.log(`User disconnected: ${socket.id}`);
            removeUser(socket.id);
            // Broadcast updated user list to remaining clients
            io.emit("getUsers", activeUsers);
            console.log("Active users after disconnection:", activeUsers);
        }
        catch (error) {
            console.error("Error handling disconnection:", error);
        }
    });
});
// Start the server
const PORT = 4580;
httpServer.listen(PORT, () => {
    console.log(`Socket.IO server running on port ${PORT}`);
});
// Error handling for the server
io.engine.on("connection_error", (err) => {
    console.error("Connection error:", err);
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
