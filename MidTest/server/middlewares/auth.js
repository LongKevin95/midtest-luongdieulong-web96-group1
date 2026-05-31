import User from "../models/userModel.js";
import Post from "../models/postModel.js";

const authMiddleware = {
  authentication: async (req, res, next) => {
    try {
      const { apiKey } = req.query;

      if (!apiKey) {
        return res.status(401).json({
          message: "API key is required",
          data: null,
          success: false,
        });
      }

      const user = await User.findOne({ apiKey });

      if (!user) {
        return res.status(401).json({
          message:
            "Authentication failed - Invalid API key/Current user not found by the API key",
          data: null,
          success: false,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },

  authorizePostOwner: async (req, res, next) => {
    try {
      const { id } = req.params;

      const post = await Post.findOne({ id });

      if (!post) {
        return res.status(404).json({
          success: false,
          message: "Post not found",
          data: null,
        });
      }

      if (post.userId !== req.user.userId) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized/Not this post author!",
          data: null,
        });
      }

      req.post = post;
      next();
    } catch (error) {
      return res.status(500).json({
        message: error.message,
        data: null,
        success: false,
      });
    }
  },
};

export default authMiddleware;
