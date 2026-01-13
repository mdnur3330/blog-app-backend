import { Request, Response } from "express";
import { postServes } from "./post.serves";
import { PostStatus } from "../../generated/prisma/enums";
import paginationSortingHelpres from "../helpers/paginationSortinHepers";
import { success } from "better-auth/*";

const getAllUser = async (req:Request,res:Response)=>{
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

        const result = await postServes.getAllUser({search:searchPost,tags:tagsPost,isFeatured,status,authorId,page,limit, skip, sortBy,sortOrder})
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

const createPost = async (req:Request,res:Response)=>{
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
        res.status(500).json({
            message: err.message
        })
    }
}

export const postControler = {
    createPost,
    getAllUser,
    getPostById
}