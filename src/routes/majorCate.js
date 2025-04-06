import express from "express";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import {
  updateMajorCategory,
  deleteMajorCategory,
  createMajorCategory,
  getMajorCategories,
} from "../controller/majorCategories.controller.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.get(
  "/api/getAllMajorCate",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN, RoleName.GUEST, RoleName.STAFF]),
  getMajorCategories
);
router.post(
  "/api/createMajor",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  createMajorCategory
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
