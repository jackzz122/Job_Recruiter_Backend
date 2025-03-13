import express from "express";
const router = express.Router();

router.get("/api/comments");
router.get("/api/comments/:id");
router.post("/api/createdComment");
router.delete("/api/deleteComment");
