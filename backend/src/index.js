import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route.js";
import messageRoute from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { app, server, io } from "./lib/socket.js";

const __filename = fileURLToPath(import.meta.url);

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use("/api/auth", authRoute);
app.use("/api/message", messageRoute);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.dirname(__filename);
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,"../../frontend","dist","index.html"));
  });
}

const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`server running successfully on ${PORT}`);
  connectDB();
});
