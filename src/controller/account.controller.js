import account from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import jobPosting from "../models/jobPosting.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
import { matchedData, validationResult } from "express-validator";
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign(user.toJSON(), process.env.JWT_SECRET, { expiresIn: maxAge });
};

const comparePassword = (password, hasPash) => {
  return bcrypt.compareSync(password, hasPash);
};

export const createUser = async (req, res, next) => {
  try {
    const { email, password, fullname } = req.body;
    const existAccount = await account.findOne({ email });

    if (existAccount) {
      return res.status(400).json({
        message: "Account existeds",
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
    console.log(findUser);
    if (!findUser) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (!comparePassword(data.password, findUser.password)) {
      return res
        .status(404)
        .json({ message: "Email or password was incorrect" });
    }

    const token = createToken(findUser);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge });
    return res.json({ message: "Account founded" });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
  } catch (err) {
    next(err);
  }
};

export const getListUsers = async (req, res, next) => {
  try {
    const listAccount = await account.find({}, { password: 0 });
    if (listAccount.length === 0)
      return res.status(404).json({ message: "None user found" });
    return res.json(listAccount);
  } catch (err) {
    next(err);
  }
};

//! Update User
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    const findUser = await account.findOne({ _id: userId });
  } catch (err) {
    next(err);
  }
};

// ! Delete user

export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.userId;
    await account.deleteOne({ _id: userId });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// ! Company Favourite
export const companyFavourite = async (req, res, next) => {
  try {
    const userId = req.userId;
    const companyId = req.params.companyID;
    const findCompany = await company.find({ _id: companyId });
    if (findCompany.length === 0)
      return res.status(404).json({ message: "Not found company" });
    const findUser = await account.find({ _id: userId });

    findUser.listFavouritesCompanyID.push(companyId);
    await findUser.save();
    return res.json({ message: "Add favourite successfull" });
  } catch (err) {
    next(err);
  }
};

// ! Job Favourite
export const jobFavourite = async (req, res, next) => {
  try {
    const userId = req.userId;
    const jobId = req.params.jobPostingID;
    const findJobPosting = await jobPosting.find({ _id: jobId });
    if (findJobPosting.length === 0)
      return res.status(404).json({ message: "Not found job posting" });
    const findUser = await account.find({ _id: userId });
    findUser.listFavouritesJobsID.push(jobId);
    await findUser.save();
    return res.json({ message: "Add job favourite successfull" });
  } catch (err) {
    next(err);
  }
};
