import express from "express";
import {
  createJobPosting,
  deleteJobPosting,
  getAllJobPostings,
  getJobPostingList,
  updateJobPosting,
} from "../controller/jobPosting.controller";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.get(
  "/api/getAllJobPosting",
  checkTokenAuthen,
  checkRoles(["admin"]),
  getAllJobPostings
);

router.get(
  "/api/jobPostingList/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF, RoleName.ADMIN]),
  getJobPostingList
);
router.post(
  "/api/staff/createJobPosting",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF]),
  createJobPosting
);
router.update(
  "/api/updateJobPosting/:jobPostingId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF]),
  updateJobPosting
);
router.delete(
  "/api/deleteJobPosting/:jobPostingId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF, RoleName.STAFF_RECRUIT, RoleName.ADMIN]),
  deleteJobPosting
);

export default router;
