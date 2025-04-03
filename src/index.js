import express from "express";
import mongoose from "mongoose";
import { handleError, handleNotFound } from "./middleware/handleError.js";
import routerAccount from "./routes/account.js";
import routerComment from "./routes/comment.js";
import routerPending from "./routes/pendingApprove.js";
import routeCompany from "./routes/companyInfo.js";
import dotenv from "dotenv";
import cors from "cors";
import accountModel from "./models/account.model.js";
import cookieParser from "cookie-parser";
const app = express();
dotenv.config();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

async function main() {
  await mongoose
    .connect(process.env.MONGODB)
    .then(() => console.log("[ ready ] Connected to MongoDB"));

  app.use(express.json());
  app.use(
    cors({
      origin: "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(cookieParser());
  // node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  app.use(routerComment);
  app.use(routerAccount);
  app.use(routerPending);
  app.use(routeCompany);
  app.use(handleError);
  app.use(handleNotFound);
}

main().catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`[ ready ] On port ${port}`);
});
