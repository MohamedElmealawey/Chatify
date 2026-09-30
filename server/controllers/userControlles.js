const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const signToken = (id, expiresIn) => jwt.sign({ id }, process.env.TOKEN_PASS, { expiresIn });

exports.signup = async (req, res) => {
  const { fullName, password, bio = "" } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  // bio is optional: the signup form lets users leave it empty
  if (!email || !fullName || !password) {
    return res.json({ success: false, message: "Missing details" });
  }
  if (password.length < 8) {
    return res.json({ success: false, message: "Password must be at least 8 characters" });
  }
  if (await User.findOne({ email })) {
    return res.json({ success: false, message: "Account already exists" });
  }

  const newUser = await User.create({ fullName, email, password, bio });
  const token = signToken(newUser._id, "7d");

  return res.json({
    success: true,
    userData: newUser, // toJSON strips the password hash
    token,
    message: "Account created successfully",
  });
};

exports.signin = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  if (!email || !password) {
    return res.json({ success: false, message: "Missing details" });
  }

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  const token = signToken(user._id, "7d");
  return res.json({ success: true, userData: user, token, message: "Login successful" });
};

exports.checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

const uploadBuffer = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "image", folder: "quickchat/avatars" }, (err, result) =>
        err ? reject(err) : resolve(result)
      )
      .end(buffer);
  });

exports.updateProfile = async (req, res) => {
  const { fullName, bio } = req.body;
  const update = {};
  if (typeof fullName === "string" && fullName.trim()) update.fullName = fullName.trim();
  if (typeof bio === "string") update.bio = bio;

  // the frontend sends the picture as a base64 data URL inside the JSON body;
  // a multipart upload (req.file, via multer) is still supported too
  if (req.file) {
    update.profilePic = (await uploadBuffer(req.file.buffer)).secure_url;
  } else if (typeof req.body.profilePic === "string" && req.body.profilePic) {
    if (!req.body.profilePic.startsWith("data:image/")) {
      return res.json({ success: false, message: "Invalid image" });
    }
    const result = await cloudinary.uploader.upload(req.body.profilePic, {
      resource_type: "image",
      folder: "quickchat/avatars",
    });
    update.profilePic = result.secure_url;
  }

  const user = await User.findByIdAndUpdate(req.user._id, update, { new: true }).select("-password");
  return res.json({ success: true, user });
};
