import express from "express";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import {
  updateMajorCategory,
  deleteMajorCategory,
  createMajorCategory,
  getMajorCategories,
  getMajorCategoryDetail,
} from "../controller/majorCategories.model.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.get(
  "/api/getAllMajorCate",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN, RoleName.GUEST, RoleName.STAFF]),
  getMajorCategories
);
router.get(
  "/api/getMajor/:majorId",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  getMajorCategoryDetail
);
router.post(
  "/api/admin/createMajorCate",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN], createMajorCategory)
);

router.put(
  "/api/admin/updateMajorCate/:majorId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN], updateMajorCategory)
);

router.delete(
  "/api/admin/deleteMajorCate/:majorId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN], deleteMajorCategory)
);

export default router;
