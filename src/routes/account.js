import express from "express";
import {
  companyFavourite,
  createUser,
  deleteUser,
  jobFavourite,
  loginUser,
  updateUser,
} from "../controller/account.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkSchema } from "express-validator";
import { accountValidator } from "../middleware/accountValidator.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.post("/api/loginAccount", checkSchema(accountValidator), loginUser);
router.post(
  "/api/createAccount",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT]),
  createUser
);
router.put(
  "/api/updateAccount",
  checkTokenAuthen,
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.STAFF_RECRUIT, RoleName.Recruit]),
  updateUser
);
router.get("/user/getListUser", checkTokenAuthen, checkRoles([RoleName.ADMIN]));
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
