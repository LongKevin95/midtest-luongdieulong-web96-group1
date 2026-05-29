import express from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware.authentication, postController.createPost);
router.put(
  "/:id",
  authMiddleware.authentication,
  authMiddleware.authorizePostOwner,
  postController.updatePost,
);

export default router;
