import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreateForumPostRequest {
  userId: number;
  title: string;
  imageUrl: string;  // Changed from 'image' to 'imageUrl'
  content: string;
  tags: string[];
}

const validateForumPostData = (
  req: Request<{}, {}, CreateForumPostRequest>,
  res: Response
): boolean => {
  const { userId, title, content, imageUrl, tags } = req.body;  // Changed from 'image' to 'imageUrl'

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

  if (!imageUrl || imageUrl.trim().length === 0) {  // Changed from 'image' to 'imageUrl'
    res.status(400).json({
      error: 'Image URL is required and cannot be empty'
    });
    return false;
  }

  // Validate image URL format
  try {
    new URL(imageUrl);
  } catch {
    res.status(400).json({
      error: 'Invalid image URL format'
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

export const createForumPost = async (
  req: Request<{}, {}, CreateForumPostRequest>,
  res: Response
) => {
  try {
    if (!validateForumPostData(req, res)) {
      return;
    }

    const { userId, title, imageUrl, content, tags } = req.body;  // Changed from 'image' to 'imageUrl'

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
        imageUrl: imageUrl.trim(),  // Changed from 'image' to 'imageUrl'
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

export const getForumPost = async (
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

    const post = await prisma.forumPost.findUnique({
      where: {
        id: postId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!post) {
      res.status(404).json({
        error: 'Forum post not found'
      });
      return;
    }

    res.status(200).json(post);
    return;
  } catch (error) {
    console.error('Error fetching forum post:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
    return;
  }
};

export const getForumPosts = async (
  req: Request<{}, {}, {}, { page?: string; limit?: string; tag?: string }>,
  res: Response
) => {
  try {
    const page = parseInt(req.query.page || '1');
    const limit = parseInt(req.query.limit || '10');
    const tag = req.query.tag;

    if (isNaN(page) || page < 1) {
      res.status(400).json({
        error: 'Invalid page number'
      });
      return;
    }

    if (isNaN(limit) || limit < 1) {
      res.status(400).json({
        error: 'Invalid limit number'
      });
      return;
    }

    const skip = (page - 1) * limit;

    const where = tag ? {
      tags: {
        has: tag.toLowerCase()
      }
    } : {};

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.forumPost.count({ where })
    ]);

    res.status(200).json({
      posts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalPosts: total,
        hasMore: skip + posts.length < total
      }
    });
    return;
  } catch (error) {
    console.error('Error fetching forum posts:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
    return;
  }
};