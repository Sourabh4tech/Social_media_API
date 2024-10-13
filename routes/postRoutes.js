const express = require("express");
const {
  createPost,
  likePost,
  commentOnPost,
  getFeed,
  nonFriends,
} = require("../controllers/postController");
const router = express.Router();

router.post("/", createPost);
router.post("/:postId/like", likePost);
router.post("/:postId/comments", commentOnPost);
router.get("/feed", getFeed);
router.get("/feed/non-friends", nonFriends);

module.exports = router;
