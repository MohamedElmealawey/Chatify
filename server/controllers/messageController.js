const Message = require("../models/Message");
const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const { userSocketMap, getIO } = require("../socket");

exports.getUsers = async (req, res) => {
  const userId = req.user._id;
  const users = await User.find({ _id: { $ne: userId } }).select("-password");

  // unread counts per sender, in a single query
  const unseen = await Message.aggregate([
    { $match: { reciverId: userId, seen: false } },
    { $group: { _id: "$senderId", count: { $sum: 1 } } },
  ]);
  const unseenMessages = {};
  unseen.forEach((u) => (unseenMessages[u._id] = u.count));

  return res.json({ success: true, users, unseenMessages });
};

exports.getUserMessages = async (req, res) => {
  const { id: selectedUserId } = req.params;
  const myId = req.user._id;

  const messages = await Message.find({
    $or: [
      { senderId: myId, reciverId: selectedUserId },
      { senderId: selectedUserId, reciverId: myId },
    ],
  }).sort({ createdAt: 1 });

  await Message.updateMany({ senderId: selectedUserId, reciverId: myId, seen: false }, { seen: true });

  return res.json({ success: true, messages });
};

exports.markMessageAsSeen = async (req, res) => {
  await Message.findOneAndUpdate({ _id: req.params.id, reciverId: req.user._id }, { seen: true });
  return res.json({ success: true });
};

exports.sendMessage = async (req, res) => {
  const { text, image } = req.body;
  const senderId = req.user._id;
  const reciverId = req.params.id;

  if (!text?.trim() && !image) {
    return res.json({ success: false, message: "Message is empty" });
  }

  let imageUrl;
  if (image) {
    if (!String(image).startsWith("data:image/")) {
      return res.json({ success: false, message: "Invalid image" });
    }
    imageUrl = (await cloudinary.uploader.upload(image, { resource_type: "image" })).secure_url;
  }

  const newMessage = await Message.create({ senderId, reciverId, text: text?.trim(), image: imageUrl });

  // push to the receiver in real time if they are online
  const receiverSocketId = userSocketMap[reciverId];
  if (receiverSocketId) getIO().to(receiverSocketId).emit("newMessage", newMessage);

  return res.json({ success: true, newMessage });
};
