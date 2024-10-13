const express = require("express");
const {
  sendRequest,
  respondRequest,
  getPendingRequests,
} = require("../controllers/friendController");
const router = express.Router();

router.post("/request", sendRequest);
router.post("/respond", respondRequest);
router.get("/pending", getPendingRequests);

module.exports = router;
