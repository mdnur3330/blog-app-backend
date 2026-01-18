import express from 'express'
import { commentController } from './comment.controller';
import { auth, UserRole } from '../../middleware/auth';

const router = express.Router()

router.get("/author/:id", commentController.getCommentByAuthor)
router.get("/:id", commentController.getCommentById)
router.post("/",auth(UserRole.ADMIN),commentController.createComment),
router.patch("/:id",auth(UserRole.ADMIN) ,commentController.updateComment)
router.patch("/admin/:id", auth(UserRole.ADMIN), commentController.updateCommentByAdmin)
router.delete("/:id",commentController.deleteComment)

export const commentRoute = router;