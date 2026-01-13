import express from 'express'
import { postControler } from './post.controler';
import { auth, UserRole } from '../middleware/auth';

const router = express.Router()

router.get("/", auth(UserRole.CUSTOMER), postControler.getAllUser)
router.get("/:id",postControler.getPostById)
router.post("/", auth(UserRole.CUSTOMER), postControler.createPost)

export const postRoute = router;