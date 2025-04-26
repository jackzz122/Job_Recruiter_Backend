import express from "express";
import {
  addApplicants,
  createJobPosting,
  deleteJobPosting,
  getJobPostingList,
  getPostingDetails,
  updateJobPosting,
} from "../controller/jobPosting.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
import { upload } from "../middleware/multerMiddle.js";
const router = express.Router();

// router.get(
//   "/api/getAllJobPosting",
//   checkTokenAuthen,
//   checkRoles(["admin"]),
//   getAllJobPostings
// );

router.get(
  "/api/jobPostingList/:companyId",
  checkTokenAuthen,
  checkRoles([
    RoleName.Recruit,
    RoleName.STAFF_RECRUIT,
    RoleName.ADMIN,
    RoleName.GUEST,
  ]),
  getJobPostingList
);
router.post(
  "/api/addApplicant/:jobId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  upload.single("linkPdf"),
  addApplicants
);
router.get(
  "/api/getDetailJob/:jobId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT, RoleName.GUEST]),
  getPostingDetails
);
router.post(
  "/api/createJobPosting",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT]),
  createJobPosting
);
router.put(
  "/api/updateJobPosting/:jobPostingId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT]),
  updateJobPosting
);
router.delete(
  "/api/deleteJobPosting/:jobPostingId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT, RoleName.ADMIN]),
  deleteJobPosting
);

export default router;
