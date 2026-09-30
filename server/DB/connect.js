const mongoose = require("mongoose");

exports.connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("DB connection success");
  } catch (error) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
