import express from "express";
import {
  addPendingList,
  getPendingList,
} from "../controller/pendingApprove.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model";
const router = express.Router();

router.get(
  "/api/admin/getPendingList",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getPendingList
);
router.post(
  "/api/addPendingApprove",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  addPendingList
);
router.delete(
  "/api/admin/deletePendingApprove/:pendingItemsId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN])
);
export default router;
