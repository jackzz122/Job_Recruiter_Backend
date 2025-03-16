import account from "../models/account.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
import { matchedData, validationResult } from "express-validator";
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

const comparePassword = (password, hasPash) => {
  return bcrypt.compareSync(password, hasPash);
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existAccount = await account.findOne({ email });

    if (existAccount) {
      return res.status(400).json({
        message: "Account existed",
      });
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.body.password = hash;

    const userAccount = new account({
      ...req.body,
      role: "guest",
    });

    await userAccount.save();

    const token = createToken(userAccount._id, userAccount.role);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge });
    return res.json({
      message: "Create Account successfully",
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const results = validationResult(req);
    if (!results.isEmpty()) {
      return res.status(400).json({ message: results.array() });
    }
    const data = matchedData(req);
    const findUser = await account.findOne({ email: data.email });
    if (!findUser) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (!comparePassword(data.password, findUser.password)) {
      return res
        .status(404)
        .json({ message: "Email or password was incorrect" });
    }
    const token = createToken(findUser._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge });
    return res.json({ message: "Account founded" });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  const userId = req.userId;
  const { body } = req;
  const findUser = await account.findOne({ _id: userId });
  res.json(findUser);
};

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    await account.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

export const companyFavourite = (req, res, next) => {};

export const jobFavourite = (req, res, next) => {};
