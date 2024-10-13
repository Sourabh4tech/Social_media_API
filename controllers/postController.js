const Post = require("../models/Post");
const User = require("../models/User");

const createPost = async (req, res) => {
  try {
    const post = new Post({ content: req.body.content, author: req.user.id });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (post.likes.includes(req.user.id)) {
      return res.status(400).send("You already liked this post");
    }
    post.likes.push(req.user.id);
    await post.save();
    res.status(200).send("Post liked");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const commentOnPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    post.comments.push({ text: req.body.text, commentedBy: req.user.id });
    await post.save();
    res.status(201).send("Comment added");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const getFeed = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the list of friends' IDs
    const friendIds = user.friends.map((friend) => friend._id);

    // Fetch all posts where the author is in the user's friends list
    const friendPosts = await Post.find({ author: { $in: friendIds } })
      .sort({ createdAt: -1 }) // Newest posts first
      .populate("author", "username");

    res.status(200).json(friendPosts);
  } catch (error) {
    console.error("Error fetching friends' posts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const nonFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the logged-in user and populate their friends list
    const user = await User.findById(userId).populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get the list of friends' IDs
    const friendIds = user.friends.map((friend) => friend._id);

    // Find all posts where a friend has commented
    const commentedPosts = await Post.find({
      "comments.commentedBy": { $in: friendIds }, // Check if friends commented
      author: { $nin: friendIds }, // Exclude posts by friends
    })
      .sort({ createdAt: -1 }) // Newest posts first
      .populate("author", "username") // Populate post author
      .populate("comments.commentedBy", "username"); // Populate comment authors

    res.status(200).json(commentedPosts);
  } catch (error) {
    console.error(
      "Error fetching non-friend posts commented by friends:",
      error
    );
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createPost, likePost, commentOnPost, getFeed, nonFriends };
