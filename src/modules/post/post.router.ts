import express from 'express'
import { postControler } from './post.controler';
import { auth, UserRole } from '../../middleware/auth';


const router = express.Router()

router.get("/", auth(UserRole.ADMIN), postControler.getAllPost)
router.get("/stats", auth(UserRole.ADMIN), postControler.getStatas)
router.get("/my-posts", auth(UserRole.ADMIN),postControler.getMyAllPost)
router.get("/:id",postControler.getPostById)
router.post("/", auth(UserRole.ADMIN), postControler.createPost)
router.patch("/:id", auth(UserRole.ADMIN,UserRole.USER), postControler.updateMyPost)
router.delete("/:id",auth(UserRole.ADMIN,UserRole.USER), postControler.deletePost)

export const postRoute = router;