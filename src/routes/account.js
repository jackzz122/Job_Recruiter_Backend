import express from "express";
import {
  changePassword,
  createUser,
  deleteUser,
  generateImproveText,
  getListRecruiter,
  getListUsers,
  getProfile,
  loginForUser,
  RegisterRecruiter,
  updateUser,
  userLogOut,
} from "../controller/account.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkSchema } from "express-validator";
import {
  accountRegisterValidator,
  accountValidator,
  recruiterRegisValidator,
} from "../middleware/accountValidator.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";

import { upload } from "../middleware/multerMiddle.js";
import {
  companyFavourite,
  jobFavourite,
  removeFavouriteCompany,
  removeFavouriteJob,
  getAppliedJobList,
} from "../controller/candidate.controller.js";
const router = express.Router();

// ! Register for Candidate
router.post(
  "/api/createAccount",
  checkSchema(accountRegisterValidator),
  createUser
);
router.get(
  "/api/appliedJobList/:userId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  getAppliedJobList
);
router.post("/api/login", checkSchema(accountValidator), loginForUser);
//! Login for Recruiter

router.post(
  "/api/RegisterRecruiter",
  checkSchema(recruiterRegisValidator),
  RegisterRecruiter
);
router.post(
  "/api/improve_text",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  generateImproveText
);
// !Get Profile for Recruiter
router.get(
  "/api/getProfileRecruiter",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT])
);

// ! Get Recruiter
router.get(
  "/api/getRecruiter/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit]),
  getListRecruiter
);

//! Get Profile for Candidate
router.get(
  "/api/getAccount",
  checkTokenAuthen,
  checkRoles([
    RoleName.GUEST,
    RoleName.STAFF_RECRUIT,
    RoleName.Recruit,
    RoleName.ADMIN,
  ]),
  getProfile
);
router.post("/api/logout", checkTokenAuthen, userLogOut);

router.put("/api/changePassword", checkTokenAuthen, changePassword);
router.patch(
  "/api/updateAccount",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  upload.single("avatarIMG"),
  updateUser
);
router.get(
  "/api/getListUser",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getListUsers
);
router.post(
  "/api/companyFavourite/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  companyFavourite
);
router.post(
  "/api/jobFavourite/:jobPostingId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  jobFavourite
);
router.delete("/api/deleteAccount", checkTokenAuthen, deleteUser);
router.delete(
  "/api/removeFavouriteCompany/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  removeFavouriteCompany
);
router.delete(
  "/api/removeFavouriteJob/:jobPostingId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  removeFavouriteJob
);
export default router;
