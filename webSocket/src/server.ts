import { Server } from "socket.io";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Replace with your frontend's URL
    methods: ["GET", "POST"],
  },
});

// Define TypeScript interfaces for event payloads
interface ClientToServerEvents {
  sendMessage: (data: { content: string; receiverId: number }) => void;
  addUser: (userId: number) => void;
}

interface ServerToClientEvents {
  getMessage: (data: { senderId: number; text: string; createdAt: string }) => void;
  getUsers: (users: { userId: number }[]) => void;
  errorMessage: (data: { message: string }) => void; // Added error message event
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  userId: number;
}

// Connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.data.userId}`);

  // Handle "addUser" event
  socket.on("addUser", (userId) => {
    console.log(`User ${userId} added`);
    io.emit("getUsers", [{ userId }]);
  });

  // Handle "sendMessage" event
  socket.on("sendMessage", (data) => {
    const { content, receiverId } = data;
    const senderId = socket.data.userId;

    // Input validation
    if (!content || typeof content !== "string" || !receiverId) {
      socket.emit("errorMessage", { message: "Invalid data" });
      return;
    }

    io.to(receiverId.toString()).emit("getMessage", {
      senderId,
      text: content,
      createdAt: new Date().toISOString(),
    });
  });

  // Middleware for socket authentication
  socket.use((packet, next) => {
    const token = socket.handshake.auth.token;

    try {
      if (!token) {
        throw new Error("Authentication token is missing");
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: number };
      socket.data.userId = decoded.userId; // Attach userId to socket data
      next();
    } catch (error) {
      next(new Error("Authentication failed"));
    }
  });

  // Disconnect handling
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.data.userId}`);
  });
});

httpServer.listen(4580, () => {
  console.log("Socket.IO server is running on port 4580");
});