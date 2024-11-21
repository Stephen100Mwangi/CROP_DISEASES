import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateForumPostRequest {
  userId: number;
  title: string;
  imageUrl: string;
  content: string;
  tags: string[];
}

const validateForumPostData = (
  req: Request<{}, {}, CreateForumPostRequest>,
  res: Response
): boolean => {
  const { userId, title, content, imageUrl, tags } = req.body;

  if (!userId) {
    res.status(400).json({
      error: 'User ID is required'
    });
    return false;
  }

  if (!title || title.trim().length === 0) {
    res.status(400).json({
      error: 'Title is required and cannot be empty'
    });
    return false;
  }

  if (!content || content.trim().length === 0) {
    res.status(400).json({
      error: 'Content is required and cannot be empty'
    });
    return false;
  }

  if (!imageUrl || imageUrl.trim().length === 0) {
    res.status(400).json({
      error: 'imageUrl is required and cannot be empty'
    });
    return false;
  }

  // Validate imageUrl string format (example for base64)
  if (imageUrl.startsWith('data:imageUrl')) {
    const isValidBase64 = /^data:imageUrl\/(png|jpeg|jpg|gif);base64,([A-Za-z0-9+/=])+$/.test(imageUrl);
    if (!isValidBase64) {
      res.status(400).json({
        error: 'Invalid imageUrl format. Must be a valid base64 encoded imageUrl'
      });
      return false;
    }
  }
  // If it's a URL, validate URL format
  else if (imageUrl.startsWith('http')) {
    try {
      new URL(imageUrl);
    } catch {
      res.status(400).json({
        error: 'Invalid image URL format'
      });
      return false;
    }
  } else {
    res.status(400).json({
      error: 'Image URL must be either a base64 encoded string or a valid URL'
    });
    return false;
  }

  // Validate tags
  if (!Array.isArray(tags)) {
    res.status(400).json({
      error: 'Tags must be an array'
    });
    return false;
  }

  return true;
};

const createForumPost = async (
  req: Request<{}, {}, CreateForumPostRequest>,
  res: Response
) => {
  try {
    if (!validateForumPostData(req, res)) {
      return;
    }

    const { userId, title, imageUrl, content, tags } = req.body;

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      res.status(404).json({
        error: 'User not found'
      });
      return;
    }

    const newPost = await prisma.forumPost.create({
      data: {
        userId,
        title: title.trim(),
        imageUrl: imageUrl.trim(),
        content: content.trim(),
        tags: tags.map(tag => tag.trim().toLowerCase()),
        likesCount: 0
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(newPost);
    return;
  } catch (error) {
    console.error('Error creating forum post:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
    return;
  }
};


export default createForumPost