import { NextFunction, Request, RequestHandler, Response } from "express";
import { postServes } from "./post.serves";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelpres from "../../helpers/paginationSortinHepers";
import { UserRole } from "../../middleware/auth";


const getAllPost = async (req:Request,res:Response)=>{
    try{
        const {search} = req.query;
        const searchPost = typeof search === "string" ? search:undefined;
        const tagsPost = req.query.tags ? (req.query.tags as string).split(","):[]

        const isFeatured = req.query.isFeatured 
        ? req.query.isFeatured === 'true'
        ?true
        :req.query.isFeatured === 'false'?false
        :undefined 
        :undefined;

        const status = req.query.status as PostStatus | undefined
        const authorId = req.query.authorId as string | undefined
        

        const {page,limit,skip,sortBy,sortOrder} = paginationSortingHelpres(req.query)
        console.log(page,limit,skip,sortBy,sortOrder);

        const result = await postServes.getAllPost({search:searchPost,tags:tagsPost,isFeatured,status,authorId,page,limit, skip, sortBy,sortOrder})
        res.status(200).json({
            message:"successfully reseved all post",
            data: result
        })
    }catch(err:any){
        res.status(500).json({
            message: err.message
        })
    }
}

const getPostById = async (req:Request,res:Response)=>{
    try{
        const {id} = req.params
        console.log(id);
        if(!id){
            throw new Error("id must needed")
        }
        const result = await postServes.getPostById(id)
        if(!result){
            throw new Error("Not Match ID")
        }
        res.status(200).json({
            success:true,
            data: result
        })
    }catch(err:any){
        res.status(500).json({
            message: err.message
        })
    }
}
const getStatas = async (req:Request,res:Response)=>{
    try{
        const result = await postServes.getStatas()
        res.status(200).json({
            success:true,
            data: result
        })
    }catch(err:any){
        res.status(500).json({
            data:"statas found faild",
            message: err.message
        })
    }
}

const getMyAllPost:RequestHandler = async (req,res)=>{
    try{
        console.log(req.user);
        const result = await postServes.getMyAllPost(req.user?.id as string)
        res.status(201).json({
            message:"successfully get my posts",
            data: result
        })
    }catch(err:any){
        res.status(500).json({
            data: "post not found",
            message: err.message
        })
    }
}

const createPost = async (req:Request,res:Response, next:NextFunction)=>{
    try{
        if(!req.user){
            return res.status(403).json({
                message: false,
                details: "unauthorize"
            })
        }
        const result = await postServes.createPost(req.body,req.user.id)
        res.status(201).json({
            message:"successfully created post",
            data: result
        })
    }catch(err:any){
        next(err)
    }
}

const updateMyPost = async (req:Request,res:Response, next:NextFunction)=>{
    try{
        if(!req.user){
            throw new Error("unAuthorize")
        }
        const user = req.user;
        const isAdmin = user.role === UserRole.ADMIN
        console.log(isAdmin);
        const id = req.params.id;
        console.log(user);
        const result = await postServes.updateMyPost(id as string ,req.body,user?.id as string, isAdmin)
        res.status(201).json({
            message:"successfully updated post",
            data: result
        })
    }catch(err:any){
       next(err)
    }
}

const deletePost = async (req:Request,res:Response)=>{
    try{
        const user = req.user;
        const isAdmin = user?.role === UserRole.ADMIN
        const result = await postServes.deletePost(req.params.id as string, user?.id as string, isAdmin)
        res.status(201).json({
            message:"successfully delete post",
            data: result
        })
    }catch(err:any){
        res.status(500).json({
            data: "post not found",
            message: err.message
        })
    }
}

export const postControler = {
    createPost,
    getAllPost,
    getPostById,
    getMyAllPost,
    updateMyPost,
    getStatas,
    deletePost
}