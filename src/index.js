import express from "express";
import mongoose from "mongoose";
import { handleError, handleNotFound } from "./middleware/handleError.js";
import routerAccount from "./routes/account.js";
import routerComment from "./routes/comment.js";
import routerPending from "./routes/pendingApprove.js";
import routeCompany from "./routes/companyInfo.js";
import routeReports from "./routes/reports.js";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import routerJobPosting from "./routes/jobPosting.js";
import routeMajors from "./routes/majorCate.js";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
dotenv.config();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://job-recruiter-gcjg.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});
// WebSocket connection handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });

  // Example: Handle custom events
  socket.on("message", (data) => {
    console.log("Received message:", data);
    // Broadcast the message to all connected clients
    io.emit("message", data);
  });
});

async function main() {
  await mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("[ ready ] Connected to MongoDB"));
  const allowedOrigins = [
    "http://localhost:5173",
    "https://job-recruiter-gcjg.vercel.app",
    "job-recruiter-gcjg-git-main-ducluongs-projects-ade1dc6c.vercel.app",
    "job-recruiter-gcjg-ou2riripz-ducluongs-projects-ade1dc6c.vercel.app",
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.options(
    "*",
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
    })
  );

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cookieParser());
  // node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  app.use(routerAccount);

  app.use(routerComment);
  app.use(routerPending);
  app.use(routeCompany);
  app.use(routeReports);
  app.use(routerJobPosting);
  app.use(routeMajors);
  app.use(handleError);
  app.use(handleNotFound);
}

main().catch((err) => console.log(err));

// Use httpServer instead of app.listen
httpServer.listen(port, () => {
  console.log(`[ ready ] Server running on port ${port}`);
  console.log(`[ ready ] WebSocket server is running`);
});
