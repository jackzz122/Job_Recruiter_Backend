import express from "express";
import { createUser } from "../controller/account.controller.js";
const router = express.Router();

router.get("/api/createAccount", createUser);
router.post("/api/createAccount", createUser);

export default router;
