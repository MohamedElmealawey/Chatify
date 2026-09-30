const express=require("express");
const { protectRoute } = require("../middleware/auth");
const { getUsers, getUserMessages, markMessageAsSeen, sendMessage } = require("../controllers/messageController");
const messageRouter=express.Router();

messageRouter.get("/users",protectRoute,getUsers);
messageRouter.get("/:id",protectRoute,getUserMessages);
messageRouter.put("/mark/:id",protectRoute,markMessageAsSeen);
messageRouter.post("/send/:id",protectRoute,sendMessage);

module.exports=messageRouter;