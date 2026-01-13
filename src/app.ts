import express, { Application, Request, Response } from 'express'
import { toNodeHandler } from "better-auth/node";
import { postRoute } from './modules/post.router';
import { auth } from './lib/auth'
import cors from "cors"

const app:Application = express();

app.use(cors({
    origin: process.env.APP_URL ||"http://localhost:3000",
    credentials:true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())

app.use("/api/v1/post",postRoute)

app.get("/",(req:Request,res:Response)=>{
    res.send("hello world")
    console.log("hello world");
})

export default app;