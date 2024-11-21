import express from "express";
import {
  createMessage,
  deleteMessage,
  getMessagesBetweenUsers,
  getAllMessages,
} from "../controllers/socket/Messages/messageController";

const messageRouter = express.Router();

// Route to create a new message
messageRouter.post("/new", createMessage);

// Route to delete a message
messageRouter.delete("/delete/:messageId", deleteMessage);

// Route to fetch messages between two users
messageRouter.get("/getMutualMessages/:userId1/:userId2", getMessagesBetweenUsers);

// Route to fetch all messages
messageRouter.get("/all", getAllMessages);

export default messageRouter;
