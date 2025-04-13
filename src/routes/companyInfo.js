import express from "express";
const router = express.Router();
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
import {
  createAccountStaff,
  createCompanyInfo,
  deleteAccountStaff,
  deleteCompanyInfo,
  getCompanyInfo,
  updateCompanyInformation,
} from "../controller/companyInfo.controller.js";
router.get(
  "/api/companyInfo/:id",
  checkTokenAuthen,
  checkRoles([
    RoleName.Recruit,
    RoleName.STAFF_RECRUIT,
    RoleName.GUEST,
    RoleName.ADMIN,
  ]),
  getCompanyInfo
);
router.post(
  "/api/createStaff",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit]),
  createAccountStaff
);
router.post(
  "/api/createCompany",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  createCompanyInfo
);
router.put(
  "/api/updateCompany/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit]),
  updateCompanyInformation
);
router.delete(
  "/api/deleteStaffAccount/:userId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit]),
  deleteAccountStaff
);
router.delete(
  "/api/deleteCompany",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT, RoleName.ADMIN]),
  deleteCompanyInfo
);
export default router;
