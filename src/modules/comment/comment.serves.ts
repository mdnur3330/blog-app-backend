import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";


const getCommentById = async (id:string)=>{
  return await prisma.comment.findUnique({
    where:{
      id
    },
    include:{
      post:{
        select:{
          id:true,
          title:true,
          content:true
        }
      }
    }
  })
}
const getCommentByAuthor = async (id:string)=>{
  console.log(id);
  return await prisma.comment.findMany({
    where:{
      authorId:id
    },
    include:{
      post:{
        select:{
          id:true,
          title:true
        }
      },
      _count: true
    }
  })
}


const createPost = async (payload:{content:string,authorId:string, postId:string, parentId?:string}) => {
  await prisma.post.findUnique({
    where:{
      id: payload.postId 
    }
  })

  if(payload.parentId){
    await prisma.comment.findUnique({
      where:{
        id: payload.parentId
      }
    })
  }

  return await prisma.comment.create({
    data: payload
  });
};

const updateComment = async (id:string,data:{content?:string,status?:CommentStatus},authorId:string)=>{
  return await prisma.comment.update({
    where:{
      id,
      authorId
    },
    data
  })
}


const updateCommentByAdmin = async (id:string,data:{status:CommentStatus})=>{
   const searchComment =  await prisma.comment.findUniqueOrThrow({
    where:{
      id
    },
    select:{
      id:true,
      status:true
    }
  })

  if(searchComment.status === data.status){
    throw new Error(`Your data ${data.status} already saync aptodet`)
  }

  return await prisma.comment.update({
    where:{
      id
    },
    data
  })
}


const deleteComment = async (id:string)=>{
  return await prisma.comment.delete({
    where:{id}
  })
}

export const commentServes = {
    createPost,
    getCommentById,
    getCommentByAuthor,
    deleteComment,
    updateComment,
    updateCommentByAdmin
}