import express from "express";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
import {
  changeStatusReportItem,
  createReport,
  deleteReportInfo,
  deleteReportItem,
  getDetailsReport,
  getReportList,
  updateReportStatus,
} from "../controller/reports.controller.js";
const router = express.Router();

router.get(
  "/api/getListReports",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getReportList
);
router.get(
  "/api/getDetailsReport/:reportId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getDetailsReport
);
router.put(
  "/api/changeStatusReport",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  changeStatusReportItem
);
router.post(
  "/api/createReport",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  createReport
);
router.put(
  "/api/updateReport/:reportId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  updateReportStatus
);
router.delete(
  "/api/deleteReport/:reportId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  deleteReportInfo
);
router.delete(
  "/api/deleteReportItem/:reportId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  deleteReportItem
);

export default router;
