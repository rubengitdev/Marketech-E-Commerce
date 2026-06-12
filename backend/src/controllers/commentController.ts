import { request, type Request, type Response } from "express";
import * as queries from "../db/queries";
import { getAuth } from "@clerk/express";

// Get all comments in a product (public)
interface CommentParams {
  id: string;
}
export const getAllComments = async (
  req: Request<CommentParams>,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const comments = await queries.getCommentById(id);
    if (!comments) return res.status(404).json({ error: "Comments not found" });

    res.status(200).json(comments);
  } catch (error) {
    console.error("Error getting comments", error);
    res
      .status(500)
      .json({ error: "Failed to get comments, something broken in your code" });
  }
};

// Create Comments in a product (protected)
export const createComment = async (req: Request, res: Response) => {
  try {
    // verify user exist
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User Unauthorized" });

    // parsing productId and content from request body
    const productId = String(req.params.productId ?? "");
    if (!productId)
      return res.status(400).json({ error: "Product id is required" });

    const { content } = req.body;
    if (!content)
      return res.status(400).json({ error: "Comment content is required!" });

    const comment = await queries.createComment({
      content,
      userId,
      productId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error("Error creating comment", error);
    res.status(500).json({
      error: "Failed to create comment, something broken in your code!",
    });
  }
};

// Delete Comments (protected -- owner only)
export const deleteComment = async (req: Request, res: Response) => {
  try {
    const { userId } = getAuth(req);
    if (!userId) return res.status(401).json({ error: "User Unauthorized" });

    const commentId = String(req.params.commentId ?? "");
    if (!commentId)
      return res.status(400).json({ error: "Comment id is required" });

    // Check if comment exist
    const existingComment = await queries.getCommentById(commentId);
    if (!existingComment)
      return res.status(404).json({ error: "Comment not found" });

    // Check if existing comment belong to user
    if (existingComment.userId !== userId) {
      return res
        .status(403)
        .json({ error: "You can only delete your own comment!" });
    }

    await queries.deleteComment(commentId);
    res.status(200).json({ message: "Comment deleted successfully " });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      error: "Failed to comment product, something broken in your code!",
    });
  }
};
