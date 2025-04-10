import express from "express";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import {
  updateMajorCategory,
  deleteMajorCategory,
  createMajorCategory,
  getMajorCategories,
  getMajorLevels,
  getNameMajors,
} from "../controller/majorCategories.controller.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.get(
  "/api/getAllMajorCate",
  checkTokenAuthen,
  checkRoles([
    RoleName.ADMIN,
    RoleName.GUEST,
    RoleName.Recruit,
    RoleName.STAFF_RECRUIT,
  ]),
  getMajorCategories
);
router.post(
  "/api/createMajor",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  createMajorCategory
);

router.get(
  "/api/getNameMajors",
  checkTokenAuthen,
  checkRoles([RoleName.Recruit, RoleName.STAFF_RECRUIT, RoleName.GUEST]),
  getNameMajors
);

router.get(
  "/api/getLevelMajors",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST, RoleName.Recruit, RoleName.STAFF_RECRUIT]),
  getMajorLevels
);

router.put(
  "/api/updateMajorCate/:majorId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  updateMajorCategory
);

router.delete(
  "/api/deleteMajorCate/:majorId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  deleteMajorCategory
);

export default router;
