const express=require("express");
const { signup, signin, updateProfile, checkAuth } = require("../controllers/userControlles");
const { protectRoute } = require("../middleware/auth");
const upload = require("../utils/multer");
const userRouter=express.Router();

userRouter.post("/signup",signup);
userRouter.post("/login",signin);
userRouter.put("/update-profile",protectRoute,upload.single("profilePic"),updateProfile);
userRouter.get("/check",protectRoute,checkAuth);

module.exports=userRouter;