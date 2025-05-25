import express from "express";
import {
  changeStatusPendingItem,
  confirmPendingItem,
  deletePendingItems,
  getPendingList,
} from "../controller/pendingApprove.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
import {
  approveAccount,
  blockedAccount,
  blockedCompanyAccount,
  deleteAccount,
  getListRecruiterCompanyAccount,
  unBlockedCompanyAccount,
} from "../controller/admin.controller.js";
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
router.get(
  "/api/getListRecruiterCompanyAccount",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getListRecruiterCompanyAccount
);
router.put(
  "/api/blockedCompanyAccount/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  blockedCompanyAccount
);
router.put(
  "/api/unBlockedCompanyAccount/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  unBlockedCompanyAccount
);
router.put(
  "/api/changePendingApproveStatus/:pendingItemId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  changeStatusPendingItem
);

router.put(
  "/api/blockedAccount/:accountId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  blockedAccount
);
router.put(
  "/api/approveAccount/:accountId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  approveAccount
);

router.delete(
  "/api/deleteAccountByAdmin/:accountId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  deleteAccount
);
router.delete(
  "/api/deletePendingApprove/:pendingItemsId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN], deletePendingItems)
);
export default router;
