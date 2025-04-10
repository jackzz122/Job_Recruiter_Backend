import express from "express";
import {
  createJobPosting,
  deleteJobPosting,
  getJobPostingList,
  updateJobPosting,
} from "../controller/jobPosting.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

// router.get(
//   "/api/getAllJobPosting",
//   checkTokenAuthen,
//   checkRoles(["admin"]),
//   getAllJobPostings
// );

router.get(
  "/api/jobPostingList",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT, RoleName.ADMIN]),
  getJobPostingList
);
router.post(
  "/api/createJobPosting",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT]),
  createJobPosting
);
router.post(
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
