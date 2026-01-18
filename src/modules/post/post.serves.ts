import { CommentStatus, Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import { UserRole } from "../../middleware/auth";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string,
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andCondition: PostWhereInput[] = [];

  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search as string,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search as string,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andCondition.push({ isFeatured });
  }

  if (status) {
    andCondition.push({ status });
  }
  if (authorId) {
    andCondition.push({ authorId });
    console.log(authorId);
  }
  const result = await prisma.post.findMany({
    take: limit,
    skip,
    where: {
      AND: andCondition,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });

  const total = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });
  return {
    data: {
      result,
    },
    pagination: {
      page,
      total,
      limit,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    const result = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
          },
          orderBy: {
            createdAt: "asc",
          },
          include: {
            replies: {
              include: {
                replies: {
                  include: {
                    replies: {
                      include: {
                        replies: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return result;
  });
};

const getMyAllPost = async (authorId: string) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
  });

  const total = await prisma.post.aggregate({
    _count: {
      authorId: true,
    },
  });

  // const total = await prisma.post.count({
  //   where:{
  //     authorId
  //   }
  // })

  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  return {
    total,
    result,
  };
};

const getStatas = async () => {
  return await prisma.$transaction(async (tx) => {
    const [totalPost, publishedPost, draftPost, archivedPosts,totalComment,approvedComment,rejejctComment, AllUser, totalAdmin,totalUser,totalPostViews] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({ where: { status: PostStatus.PUBLISHED } }),
      await tx.post.count({ where: { status: PostStatus.DRAFT } }),
      await tx.post.count({where:{status:PostStatus.ARCHIVED}}),
      await tx.comment.count(),
      await tx.comment.count({where: {status:CommentStatus.APPROVED}}),
      await tx.comment.count({where: {status:CommentStatus.REJECT}}),
      await tx.user.count(),
      await tx.user.count({where:{role:UserRole.ADMIN}}),
      await tx.user.count({where:{role:UserRole.USER}}),
      await tx.post.aggregate({
        _sum:{views:true}
      })
    ]);

    return {
      totalPost,
      publishedPost,
      draftPost,
      archivedPosts,
      totalComment,
      approvedComment,
      rejejctComment,
      AllUser,
      totalUser,
      totalAdmin,
      totalPostViews: totalPostViews._sum.views
    };
  });
};

const updateMyPost = async (
  id: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean,
) => {
  const postData = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData?.authorId !== authorId) {
    throw new Error("You Are Not Authrize");
  }

  if (!isAdmin) {
    delete data.isFeatured;
  }
  return await prisma.post.update({
    where: {
      id,
    },
    data: data,
  });
};

const deletePost = async (id: string, authorId: string, isAdmin: boolean) => {
  const postData = await prisma.post.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData?.authorId !== authorId) {
    throw new Error("You Are Not Authrize");
  }
  return await prisma.post.delete({
    where: { id },
  });
};

export const postServes = {
  createPost,
  getAllPost,
  getPostById,
  deletePost,
  updateMyPost,
  getMyAllPost,
  getStatas,
};
