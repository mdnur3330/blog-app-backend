import express, { Application } from 'express'
import { toNodeHandler } from "better-auth/node";
import { auth } from './lib/auth'
import cors from "cors"
import { commentRoute } from './modules/comment/comment.router';
import { postRoute } from './modules/post/post.router';
import errorHandler from './middleware/globleErrorHandler';
import { notFound } from './middleware/notFoud';

const app:Application = express();

app.use(cors({
    origin: process.env.APP_URL ||"http://localhost:3000",
    credentials:true
}))

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json())

app.use("/api/v1/post",postRoute)
app.use("/api/v1/comment",commentRoute)

app.use(errorHandler)
app.use(notFound)
export default app;