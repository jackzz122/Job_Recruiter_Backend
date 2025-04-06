import express from "express";
import {
  blockPendingItem,
  confirmPendingItem,
  deletePendingItems,
  getPendingList,
} from "../controller/pendingApprove.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.get(
  "/api/getPendingList",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getPendingList
);
router.post(
  "/api/confirmPendingItem/:userId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  confirmPendingItem
);
router.post(
  "/api/blockPendingItem/:userId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  blockPendingItem
);
router.delete(
  "/api/deletePendingApprove/:pendingItemsId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN], deletePendingItems)
);
export default router;
