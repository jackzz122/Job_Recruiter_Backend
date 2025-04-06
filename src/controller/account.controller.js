import account from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import jobPosting from "../models/jobPosting.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
import pendingApprove from "../models/pendingApprove.js";
import { matchedData, validationResult } from "express-validator";
import { RoleName } from "../models/account.model.js";
import { validateRequest } from "../services/validateRequest.js";
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

export const comparePassword = (password, hasPash) => {
  return bcrypt.compareSync(password, hasPash);
};

// ! Create User for Candidate (checked)
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
// !Login User for Candidate (Checked)
export const loginUser = async (req, res, next) => {
  try {
    const { isValid, errors, validData } = validateRequest(req);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const data = validData;
    const findUser = await account.findOne({ email: data.email }); //! return object
    if (!findUser) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (!comparePassword(data.password, findUser.password)) {
      return res
        .status(404)
        .json({ message: "Email or password was incorrect" });
    }
    const token = createToken(findUser);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * maxAge,
    });
    return res.json({ message: "Account founded" });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  // try {
  // } catch (err) {
  //   next(err);
  // }
};
// ! Logout user
export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.json({ message: "Logout successfully" });
  } catch (err) {
    next(err);
  }
};
// ! Login For Recruiter
export const LoginRecruiter = async (req, res, next) => {
  try {
    const { isValid, errors, validData } = validateRequest(req);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const data = validData;
    const findRecruiter = await account.findOne({ email: data.email });
    if (!findRecruiter) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (!comparePassword(data.password, findRecruiter.password)) {
      return res
        .status(404)
        .json({ message: "Email or password was incorrect" });
    }
    if (findRecruiter.role !== RoleName.Recruit) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this" });
    }
    const token = createToken(findRecruiter);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge });
    return res.json({ message: "Account founded" });
  } catch (err) {
    next(err);
  }
};

export const adminLogin = async (req, res, next) => {
  try {
    const { isValid, errors, validData } = validateRequest(req);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const data = validData;
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
    if (findUser.role !== RoleName.ADMIN) {
      return res
        .status(403)
        .json({ message: "You are not authorized to access this" });
    }
    const token = createToken(findUser);
    res.cookie("jwt", token, { httpOnly: true, maxAge: 1000 * maxAge });
    return res.status(200).json({ message: "Account founded" });
  } catch (err) {
    next(err);
  }
};

// ! Register for Recruiter
export const RegisterRecruiter = async (req, res, next) => {
  try {
    const { isValid, errors, validData } = validateRequest(req);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const data = validData;
    const findAccount = await account.findOne({ email: data.email });
    if (!findAccount) {
      return res.status(404).json({ message: "Account not found" });
    }
    if (findAccount.role === RoleName.Recruit) {
      return res.status(403).json({ message: "You are already are Recruiter" });
    }
    if (findAccount.role === RoleName.ADMIN) {
      return res.status(403).json({ message: "You are already are Admin" });
    }
    const pendingItem = await pendingApprove.findOne({
      accountID: findAccount._id,
    });
    if (!pendingItem) {
      const newPendingItem = new pendingApprove({
        ...data,
        accountID: findAccount._id,
      });
      await newPendingItem.save();
      return res.json({
        message: "Request successfully",
      });
    } else
      return res.status(403).json({ message: "You are already send request" });
  } catch (err) {
    next(err);
  }
};

// !Get Profile for Candidate (Checked)
export const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    const { password, ...currentUser } = req.user;
    if (req.user.role === RoleName.Recruit) {
      const findUser = await account
        .findOne({ _id: req.user._id })
        .populate("companyId")
        .lean();
      if (findUser) {
        const { password, ...currentUser } = findUser;
        return res.status(200).json({ success: true, user: currentUser });
      }
    }
    return res.status(200).json({ success: true, user: currentUser });
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

export const getListRecruiter = async (req, res, next) => {
  try {
    const listRecruiter = await account.find({
      role: RoleName.STAFF_RECRUIT,
      companyId: req.params.companyId,
    });
    if (listRecruiter.length === 0)
      return res.status(404).json({ message: "None user found" });
    return res.json(listRecruiter);
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

export const userLogOut = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1 });
    return res.json({ message: "Logout successfully" });
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
