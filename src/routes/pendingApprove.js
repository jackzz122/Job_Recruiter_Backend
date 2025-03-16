import express from "express";
import {
  addPendingList,
  getPendingList,
} from "../controller/pendingApprove.controller";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen";
const router = express.Router();

router.post("/api/addPendingApprove", checkTokenAuthen, addPendingList);

export default router;
