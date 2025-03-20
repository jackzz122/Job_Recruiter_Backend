import express from "express";
const router = express.Router();
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
import {
  createAccountStaff,
  createCompanyInfo,
  deleteCompanyInfo,
  getCompanyInfo,
  updateCompanyInfo,
} from "../controller/companyInfo.controller.js";
router.get(
  "/api/companyInfo/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT,, RoleName.STAFF_RECRUIT, RoleName.GUEST, RoleName.ADMIN]),
  getCompanyInfo
);
router.post("/api/staff/createStaff", checkTokenAuthen, checkRoles([RoleName.Recruit]), createAccountStaff)
router.post(
  "/api/createCompany",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN], createCompanyInfo)
);
router.put(
  "/api/updateCompany",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit], updateCompanyInfo)
);
router.delete(
  "/api/deleteCompany",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT, RoleName.ADMIN], deleteCompanyInfo)
);
export default router;
