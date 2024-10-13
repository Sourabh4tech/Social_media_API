const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

const sendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const request = new FriendRequest({
      requester: req.user.id,
      recipient: recipientId,
    });
    await request.save();
    res.status(201).send("Friend request sent");
  } catch (error) {
    res.status(500).send(error.message);
  }
};

//   try {
//     const { requestId, status } = req.body;
//     const request = await FriendRequest.findById(requestId);
//     request.status = status;
//     await request.save();
//     res.status(200).send("Friend request updated");
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// };

// Example of Accepting a Friend Request
// const respondRequest = async (req, res) => {
//   const { requestId, status } = req.body;
//   try {
//     // Find the friend request by ID
//     const friendRequest = await FriendRequest.findById(requestId);

//     if (!friendRequest) {
//       return res.status(404).json({ message: "Friend request not found." });
//     }

//     // Update the friend request status
//     friendRequest.status = status; // e.g., "accepted" or "rejected"
//     await friendRequest.save();

//     // Handle additional logic (e.g., updating users' friends list)
//     if (status === "accepted") {
//       const sender = await User.findById(friendRequest.senderId);
//       const recipient = await User.findById(friendRequest.recipientId);
//       sender.friends.push(recipient._id);
//       recipient.friends.push(sender._id);
//       await sender.save();
//       await recipient.save();
//     }

//     return res.status(200).json({ message: "Friend request accepted." });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal server error." });
//   }
// };

const respondRequest = async (req, res) => {
  const { requestId, status } = req.body;
  console.log(`Received requestId: ${requestId}`); // Log to check what is being received

  try {
    // Check if requestId is provided
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required." });
    }

    // Find the friend request by ID
    const friendRequest = await FriendRequest.findById(requestId);

    if (!friendRequest) {
      console.log(`Friend request with ID ${requestId} not found.`);
      return res.status(404).json({ message: "Friend request not found." });
    }

    // Update the friend request status
    friendRequest.status = status; // e.g., "accepted" or "rejected"
    await friendRequest.save();

    // Handle additional logic (e.g., updating users' friends list)
    if (status === "accepted") {
      const sender = await User.findById(friendRequest.senderId);
      const recipient = await User.findById(friendRequest.recipientId);
      sender.friends.push(recipient._id);
      recipient.friends.push(sender._id);
      await sender.save();
      await recipient.save();
    }

    return res.status(200).json({ message: "Friend request accepted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

const getPendingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      recipient: req.user.id,
      status: "pending",
    }).populate("requester", "username");
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = { sendRequest, respondRequest, getPendingRequests };
