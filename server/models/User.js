const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    // the frontend does `user.profilePic || defaultAvatar`, so this must be a
    // URL string (an empty string is falsy, an empty object {} is not)
    profilePic: { type: String, default: "" },
    bio: { type: String, default: "" },
  },
  { timestamps: true }
);

// hash only when the password actually changed (not on every save)
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// never leak the hash, and clean up old documents that stored profilePic as {}
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.password;
    if (typeof ret.profilePic !== "string") ret.profilePic = "";
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
