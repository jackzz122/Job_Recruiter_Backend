import express from "express";
import {
  createComment,
  DeleteComment,
  getCommentCompanies,
} from "../controller/comment.controller";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen";
import { checkRoles } from "../middleware/checkRoles";
const router = express.Router();

router.get("/api/comments/:companyId", getCommentCompanies);
router.post("/api/createdComment", checkTokenAuthen, createComment);
router.delete(
  "/api/deleteComment",
  checkTokenAuthen,
  checkRoles(["admin"]),
  DeleteComment
);
