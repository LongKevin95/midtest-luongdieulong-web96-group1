import User from "../models/userModel.js";

const authMiddleware = {
  verifyApiKey: async (req, res, next) => {
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
          message: "Invalid API key",
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
};

export default authMiddleware;
