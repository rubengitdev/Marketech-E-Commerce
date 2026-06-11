import { Router } from "express";
import * as commentController from "../controllers/commentController";
import { requireAuth } from "@clerk/express";

const router = Router();

// GET /api/comments => Get all comments (public)
router.get("/", commentController.getAllComments);

// POST /api/comments => Create comment to product (protected)
router.post("/:productId", requireAuth(), commentController.createComment);

// DELETE /api/comments/:id => Delete comment (protected - owner only)
router.delete("/:commentId", requireAuth(), commentController.deleteComment);

export default router;