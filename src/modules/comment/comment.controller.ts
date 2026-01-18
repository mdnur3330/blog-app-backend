import { RequestHandler } from "express";
import { commentServes } from "./comment.serves";
import { success } from "better-auth/*";

const getCommentById:RequestHandler = async (req,res)=>{
    try{
        const id = req.params.id;
        if(!id)return"plase input commint id"
        const result = await commentServes.getCommentById(id)
        res.status(200).json({
            success:true,
            message: "got comment successfully",
            data:result
        })
    }catch(err:any){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}
const getCommentByAuthor:RequestHandler = async (req,res)=>{
    try{
        const id = req.params.id;
        console.log("this is author id",id);
        const result = await commentServes.getCommentByAuthor(id as string)
        res.status(200).json({
            success:true,
            message: "got comment successfully",
            data:result
        })
    }catch(err:any){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}

const createComment:RequestHandler = async (req,res)=>{
    try{
        const user = req.user
        req.body.authorId = user?.id;
        const result = await commentServes.createPost(req.body)
        res.status(201).json({
            success:true,
            message: "successfully commented",
            data: result
        })
    }catch(err:any){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}

const updateComment:RequestHandler = async (req,res)=>{
    try{
        const id = req.params.id;
        const user  = req.user
        const result = await commentServes.updateComment(id as string,req.body,user?.id as string )
        res.status(200).json({
            success:true,
            message: "update successfully",
            data: result
        })
    }catch(err:any){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}

const updateCommentByAdmin:RequestHandler = async (req,res)=>{
    try{
        const id = req.params.id
        const result = await commentServes.updateCommentByAdmin(id as string,req.body)
        res.status(200).json({
            success:true,
            message: "update successfully",
            data: result
        })
    }catch(err:any){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}

const deleteComment:RequestHandler = async (req,res)=>{
    try{
        const id = req.params.id
        const result = await commentServes.deleteComment(id as string)
        res.status(200).json({
            success:true,
            message: "delete successfully",
            data: result
        })
    }catch(err:any){
        res.status(400).json({
            success:false,
            message: err.message
        })
    }
}


export const commentController = {
    createComment,
    getCommentById,
    getCommentByAuthor,
    updateComment,
    updateCommentByAdmin,
    deleteComment
}