require("dotenv").config(); // must run before any module reads process.env
const express = require("express");
const http = require("http");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { connectDB } = require("./DB/connect");
const userRouter = require("./routes/userRoutes");
const messageRouter = require("./routes/messageRoutes");
const { initSocket } = require("./socket");

const app = express();
const server = http.createServer(app);
initSocket(server);

app.use(cookieParser());
app.use(cors({ credentials: true }));
// images are sent as base64 data URLs in JSON, so allow a larger body
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

app.get("/", (req, res) => res.send("Server is live"));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// JSON error handler (Express 5 forwards async errors here), so the
// frontend always gets { success:false, message } instead of a hanging request
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  console.error(err.message);
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Account already exists" });
  }
  if (err.type === "entity.too.large") {
    return res.status(413).json({ success: false, message: "Image is too large (max ~10MB)" });
  }
  res.status(err.status || 500).json({ success: false, message: err.message || "Server error" });
});

const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  server.listen(PORT, () => console.log(`App is running at port ${PORT}`));
});
