import { NextFunction, Request, Response } from "express"
import {auth as BetterAuth} from '../lib/auth'




declare global{
    namespace Express {
        interface Request{
            user?:{
                id:string;
                email:string;
                name:string;
                role:string;
                emailVerified:boolean;
            }
        }
    }
}

export enum UserRole{
    USER="USER",
    ADMIN="ADMIN",
    CUSTOMER="COUSTOMER"
}

export const auth = (...roles:UserRole[])=>{
    return async (req:Request, res:Response, next:NextFunction)=>{
        const session = await BetterAuth.api.getSession({
            headers: req.headers as any
        })

        if(!session){
            return res.status(401).json({
                success: false,
                message: "you are not authorized"
            })
        }
        if(!session.user.emailVerified){
            return res.status(401).json({
                success: false,
                message: "email verifiy requird"
            })
        }

        req.user = {
            id: session.user.id,
            email:session.user.email,
            name:session.user.name,
            role:session.user.role as string,
            emailVerified:session.user.emailVerified
        }

        if(roles.length && !roles.includes(req.user.role as UserRole)){
            return res.status(403).json({
                success:false,
                message: 'Forbidden! You do not have permission to access this resources'
            })
        }
        next()
    }
}
