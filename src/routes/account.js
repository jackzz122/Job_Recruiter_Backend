import express from "express";
import {
  createUser,
  deleteUser,
  loginUser,
  updateUser,
} from "../controller/account.controller.js";
import { checkTokenAuthen } from "../middleware/checkTokenAuthen.js";
import { body, checkSchema } from "express-validator";
import { accountValidator } from "../middleware/accountValidator.js";
import { checkRoles } from "../middleware/checkRoles.js";
const router = express.Router();

router.post("/api/loginAccount", checkSchema(accountValidator), loginUser);
router.post("/api/createAccount", createUser);
router.put("/api/updateAccount", checkTokenAuthen, updateUser);
router.get("/user/getListUser", checkTokenAuthen, checkRoles(["admin"]));
router.delete("/api/deleteAccount", checkTokenAuthen, deleteUser);
export default router;
