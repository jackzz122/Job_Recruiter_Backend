import express from "express";
import {
  addApplicants,
  changeStatusJobPosting,
  createJobPosting,
  deleteJobPosting,
  getAllJobPosting,
  getCandidateFromJobPosting,
  getJobPostingList,
  getPostingDetails,
  removeApplicants,
  updateJobPosting,
} from "../controller/jobPosting.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
import { upload } from "../middleware/multerMiddle.js";
import { changeStatus } from "../controller/companyInfo.controller.js";
const router = express.Router();

// router.get(
//   "/api/getAllJobPosting",
//   checkTokenAuthen,
//   checkRoles(["admin"]),
//   getAllJobPostings
// );
router.get(
  "/api/getAllJobPosting",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.ADMIN]),
  getAllJobPosting
);
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
  "/api/changeStatusJobPosting/:jobId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  changeStatusJobPosting
);
router.get(
  "/api/getCandidateFromJobPosting/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  getCandidateFromJobPosting
);
router.post(
  "/api/changeStatus/:userId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  changeStatus
);
router.post(
  "/api/addApplicant/:jobId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  upload.single("linkPdf"),
  addApplicants
);
router.delete(
  "/api/deleteApplicant/:userId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT]),
  removeApplicants
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
