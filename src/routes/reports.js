import express from "express";
import {checkTokenAuthen} from "../middleware/checkTokenAuthen.js"
import {checkRoles} from "../middleware/checkRoles.js"
import { RoleName } from "../models/account.model.js";
import { createReport, deleteReportInfo, getReportList, updateReportStatus } from "../controller/reports.controller.js";
const router = express.Router();

router.get("/api/admin/getListReports", checkTokenAuthen, checkRoles([RoleName.ADMIN]), getReportList);
router.post("/api/createReport", checkTokenAuthen, checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT, RoleName.Recruit]), createReport);
router.put("/api/admin/updateReport/:reportId", checkTokenAuthen, checkRoles([RoleName.ADMIN]), updateReportStatus)
router.delete("/api/deleteReport/:reportId", checkTokenAuthen, checkRoles([RoleName.ADMIN]), deleteReportInfo)

export default router;