import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Types for request body validation
interface CreateCommentRequest {
  userId: number;
  content: string;
  forumPostId?: number;
}

interface ErrorResponse {
  error: string;
  details?: any;
}

/**
 * Validates the comment request data and handles response
 * @param req Express request object
 * @param res Express response object
 * @returns boolean indicating if validation passed
 */
const validateCommentData = (
  req: Request<{}, {}, CreateCommentRequest>,
  res: Response
): boolean => {
  const { userId, content } = req.body;

  if (!userId) {
    res.status(400).json({
      error: 'User ID is required'
    });
    return false;
  }
  
  if (!content) {
    res.status(400).json({
      error: 'Content is required'
    });
    return false;
  }
  
  if (content.trim().length === 0) {
    res.status(400).json({
      error: 'Comment content cannot be empty'
    });
    return false;
  }
  
  return true;
};

/**
 * Creates a new comment
 */
export const createComment = async (
  req: Request<{}, {}, CreateCommentRequest>,
  res: Response
) => {
  try {
    const { userId, content, forumPostId } = req.body;

    // Validate input data
    if (!validateCommentData(req, res)) {
      return; // Response already sent in validation function
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      res.status(404).json({
        error: 'User not found'
      });
      return;
    }

    // If forumPostId is provided, check if the post exists
    if (forumPostId) {
      const postExists = await prisma.forumPost.findUnique({
        where: { id: forumPostId },
      });

      if (!postExists) {
        res.status(404).json({
          error: 'Forum post not found'
        });
        return;
      }
    }

    // Create the comment
    const newComment = await prisma.comment.create({
      data: {
        userId,
        content: content.trim(),
        forumPostId,
      },
    });

    res.status(201).json(newComment);
    return ;
  } catch (error) {
    console.error('Error creating comment:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
    return;
  }
};

/**
 * Gets comments for a specific post
 */
export const getCommentsForPost = async (
  req: Request<{ postId: string }>,
  res: Response
) => {
  try {
    const postId = parseInt(req.params.postId);
    
    if (isNaN(postId)) {
      res.status(400).json({
        error: 'Invalid post ID'
      });
      return;
    }

    const comments = await prisma.comment.findMany({
      where: {
        forumPostId: postId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.status(200).json(comments);
    return;
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined,
    });
    return;
  }
};

