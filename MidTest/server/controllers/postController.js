import Post from "../models/postModel.js";
import crypto from "crypto";

const formatDateTime = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

const formatPostResponse = (post) => ({
  ...post.toObject(),
  createdAt: formatDateTime(post.createdAt),
  updatedAt: formatDateTime(post.updatedAt),
});

const createPost = async (req, res) => {
  try {
    const { title = "No title", content } = req.body;

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized/Not logged in!",
        data: null,
      });
    }

    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Content is required!",
        data: null,
      });
    }
    // p-{randomString}
    const randomString = crypto.randomBytes(5).toString("hex");
    const postId = `p-${randomString}`;

    const post = new Post({
      id: postId,
      userId: req.user.userId,
      title,
      content,
    });

    await post.save();

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: formatPostResponse(post),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { title, content } = req.body;
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

    if (title !== undefined) {
      post.title = title;
    }

    if (content !== undefined) {
      post.content = content;
    }

    post.updatedAt = Date.now();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: formatPostResponse(post),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export default { createPost, updatePost };
