import express from "express";
import {
  createComment,
  DeleteComment,
  getCommentCompanies,
} from "../controller/comment.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { checkRoles } from "../middleware/checkRoles.js";
import { RoleName } from "../models/account.model.js";
const router = express.Router();

router.get(
  "/api/company/comments/:companyId",
  checkTokenAuthen,
  checkRoles([RoleName.STAFF_RECRUIT, RoleName.GUEST]),
  getCommentCompanies
);
router.post(
  "/api/reatedComment",
  checkTokenAuthen,
  checkRoles([RoleName.GUEST]),
  createComment
);
router.delete(
  "/api/deleteComment/:commentId",
  checkTokenAuthen,
  checkRoles([RoleName.ADMIN]),
  DeleteComment
);

export default router;
