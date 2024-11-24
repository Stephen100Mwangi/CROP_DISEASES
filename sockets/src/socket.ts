import { Server } from 'socket.io';
import { createServer } from 'http';

// Define interfaces
interface User {
    userId: string;
    socketId: string;
}

interface ServerToClientEvents {
    getUsers: (users: User[]) => void;
    receiveMessage: (message:Message) => void;
    messageSent: (message:Message) => void;

}

interface ClientToServerEvents {
    newUser: (userId: string) => void;
    disconnect: () => void;
    sendMessage: (message: Omit <Message, 'timestamp'>) => void;
}

interface Message {
    senderId: string;
    receiverId: string;
    content: string;
    timestamp: number;
}

// Create HTTP server and Socket.IO instance
const httpServer = createServer();
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    },
    pingTimeout: 60000, // 1 minute timeout
});

// Store active users
let activeUsers: User[] = [];

// Helper functions
const addUser = (userId: string, socketId: string): void => {
    if (!activeUsers.some(user => user.userId === userId)) {
        activeUsers.push({ userId, socketId });
    }
};

const removeUser = (socketId: string): void => {
    activeUsers = activeUsers.filter(user => user.socketId !== socketId);
};

// Socket connection handler
io.on("connection", (socket) => {
    console.log(`New connection: ${socket.id}`);

    // Handle new user joining
    socket.on("newUser", (userId: string) => {
        try {
            if (!userId) {
                throw new Error("UserId is required");
            }

            addUser(userId, socket.id);
            console.log("Active users after new connection:", activeUsers);
            
            // Broadcast updated user list to all connected clients
            io.emit("getUsers", activeUsers);
        } catch (error) {
            console.error("Error handling new user:", error);
            socket.disconnect();
        }
    });

    // Handle a new Message - Send it to the receiver and update the sender's and receiver's UI
    socket.on("sendMessage",({senderId, receiverId,content}) =>{
        try {
            const message: Message = {
                senderId,
                receiverId,
                content,
                timestamp: Date.now()
            }


            // Fetch receiver's socket
            const receiver = activeUsers.find(user => user.userId === receiverId.toString());
            if(receiver){
                io.to(receiver.socketId).emit("receiveMessage",message);
            }

            socket.emit("messageSent",message);
        } catch (error) {
            console.error("Error sending message:", error);
        }

    })


    // Handle disconnection
    socket.on("disconnect", () => {
        try {
            console.log(`User disconnected: ${socket.id}`);
            removeUser(socket.id);
            
            // Broadcast updated user list to remaining clients
            io.emit("getUsers", activeUsers);
            console.log("Active users after disconnection:", activeUsers);
        } catch (error) {
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