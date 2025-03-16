import express from "express";
import {
  deleteJobPosting,
  getJobPostingList,
  updateJobPosting,
} from "../controller/jobPosting.controller";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen";
import { checkRoles } from "../middleware/checkRoles";
const router = express.Router();

router.get(
  "/api/getJobPostingList",
  checkTokenAuthen,
  checkRoles(["staff", "admin"]),
  getJobPostingList
);
router.update(
  "/api/updateJobPosting/:id",
  checkTokenAuthen,
  checkRoles(["staff"]),
  updateJobPosting
);
router.delete(
  "/api/deleteJobPosting/:id",
  checkTokenAuthen,
  checkRoles(["staff", "admin"]),
  deleteJobPosting
);

export default router;
