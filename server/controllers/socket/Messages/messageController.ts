import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Controller to create a new message
export const createMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { senderId, receiverId, content, status } = req.body;

    // Basic validation without express-validator
    if (!senderId || isNaN(Number(senderId))) {
      res.status(400).json({ success: false, message: "Sender ID is required and must be a number." });
      return;
    }
    if (!receiverId || isNaN(Number(receiverId))) {
      res.status(400).json({ success: false, message: "Receiver ID is required and must be a number." });
      return;
    }
    if (!content) {
      res.status(400).json({ success: false, message: "Message content is required." });
      return;
    }

    // We autofill senderName and senderEmail
    const senderFound = await prisma.user.findUnique({
      where: { id: parseInt(senderId) },
      select: {
        email: true,
        name: true      
      },
    });

    if (!senderFound || !senderFound.email || !senderFound.name) {
      res.status(400).json({ message: "Sender not found" });
      return;
    }

    const { email: senderEmail, name: senderName } = senderFound;

    const newMessage = await prisma.message.create({
      data: {
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        senderEmail,
        senderName,
        content,
        status: status || "sent", // Default to "sent" if not provided
      },
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating message." });
  }
};


// Controller to delete an existing message
export const deleteMessage = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { messageId } = req.params;

  // Basic validation for messageId
  if (!messageId || isNaN(Number(messageId))) {
    res.status(400).json({ success: false, message: "Invalid message ID." });
    return;
  }

  try {
    const deletedMessage = await prisma.message.delete({
      where: { id: parseInt(messageId, 10) },
    });

    res.status(200).json({ success: true, data: deletedMessage });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting message." });
  }
};

// Controller to fetch messages between two users
export const getMessagesBetweenUsers = async (req: Request, res: Response): Promise<void> => {
  const { userId1, userId2 } = req.params;

  if (!userId1 || !userId2 || isNaN(Number(userId1)) || isNaN(Number(userId2))) {
    res.status(400).json({ success: false, message: "Invalid user IDs." });
    return;
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(userId1, 10),
            receiverId: parseInt(userId2, 10),
          },
          {
            senderId: parseInt(userId2, 10),
            receiverId: parseInt(userId1, 10),
          },
        ],
      },
      orderBy: { timestamp: "asc" }, // Sort messages by timestamp
    });

    if (messages.length === 0) {
      res.status(204).json({ message: "No conversations between the two users" });
      return;
    }

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error fetching messages." });
  }
};


// Controller to fetch all messages
export const getAllMessages = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { timestamp: "asc" }, // Sort messages by timestamp
    });

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching messages." });
  }
};
