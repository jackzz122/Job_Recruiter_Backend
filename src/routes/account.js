import express from "express";
import {
  adminLogin,
  companyFavourite,
  createUser,
  deleteUser,
  getListRecruiter,
  getListUsers,
  getProfile,
  jobFavourite,
  LoginRecruiter,
  loginUser,
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
const router = express.Router();

// ! Login For Candidate
router.post("/api/loginAccount", checkSchema(accountValidator), loginUser);
// ! Register for Candidate
router.post(
  "/api/createAccount",
  checkSchema(accountRegisterValidator),
  createUser
);

//! Login for Recruiter
router.post(
  "/api/loginRecruiter",
  checkSchema(accountValidator),
  LoginRecruiter
);
//! Register for Recruiter
router.post(
  "/api/RegisterRecruiter",
  checkSchema(recruiterRegisValidator),
  RegisterRecruiter
);
//! register for admin
router.post("/api/adminLogin", checkSchema(accountValidator), adminLogin);

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
router.put(
  "/api/updateAccount",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  updateUser
);
router.get(
  "/api/getListUser",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  getListUsers
);
router.post(
  "/api/companyFavourite/:companyID",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  companyFavourite
);
router.post(
  "/api/jobFavourite/:jobPostingID",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  jobFavourite
);
router.delete("/api/deleteAccount", checkTokenAuthen, deleteUser);
export default router;
