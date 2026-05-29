import express from "express";
import postController from "../controllers/postController.js";
import authMiddleware from "../middlewares/auth.js";

const router = express.Router();

router.post("/", authMiddleware.verifyApiKey, postController.createPost);
router.put("/:id", authMiddleware.verifyApiKey, postController.updatePost);

export default router;
