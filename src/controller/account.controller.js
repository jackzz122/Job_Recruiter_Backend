import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";

import { validateRequest } from "../services/validateRequest.js";
import comment from "../models/comments.model.js";
import { apiResponse } from "../helper/response.helper.js";
import { GoogleGenAI } from "@google/genai";
import candidateService from "../services/candidate.service.js";
import authService from "../services/auth.service.js";
import adminService from "../services/admin.service.js";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role, companyId: user.companyId },
    process.env.JWT_SECRET,
    {
      expiresIn: maxAge,
    }
  );
};

export const comparePassword = async (password, hasPash) => {
  return await bcrypt.compare(password, hasPash);
};

// ! Create User for Candidate (checked)
export const createUser = async (req, res, next) => {
  try {
    const userAccount = await authService.createUser(req.body);
    const token = authService.createToken(userAccount);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * maxAge,
      secure: true,
      sameSite: "none",
    });
    const response = apiResponse.success("Register successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { message, id } = await authService.forgotPassword(email);
    const response = apiResponse.success(id, message);
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const verifyCode = async (req, res, next) => {
  try {
    const { code } = req.body;
    const data = await authService.verifyCode(req.body.id, code);
    const response = apiResponse.success(data, "Code verified successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword, id } = req.body;
    const updatedUser = await authService.resetPassword(id, newPassword);
    const response = apiResponse.success(
      updatedUser,
      "Change password success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const changePassword = async (req, res, next) => {
  try {
    const currentUser = await authService.changePassword(
      req.user._id,
      req.body.oldPassword,
      req.body.newPassword
    );
    const response = apiResponse.success(
      currentUser,
      "Change password success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
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
export const UserSearch = async (req, res, next) => {};
export const loginForUser = async (req, res, next) => {
  try {
    const { isValid, errors, validData } = validateRequest(req);
    if (!isValid) {
      return res.status(400).json(errors);
    }

    const findUser = await authService.loginUser(
      validData.email,
      validData.password,
      req.body.roleGroup
    );

    const token = authService.createToken(findUser);
    res.cookie("jwt", token, {
      httpOnly: true,
      maxAge: 1000 * maxAge,
      secure: true,
      sameSite: "none",
    });
    return res.status(200).json({ message: "Account found" });
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

    const pendingItem = await authService.registerRecruiter(validData);
    const response = apiResponse.success(pendingItem, "Request successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

// !Get Profile for Candidate (Checked)
export const getProfile = async (req, res, next) => {
  try {
    if (!req.user) {
      const response = apiResponse.notFound("User not found");
      return res.status(response.status).json(response.body);
    }

    const currentUser = await candidateService.getProfile(
      req.user._id,
      req.user.role
    );
    const response = apiResponse.success(currentUser, "Get user success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getListUsers = async (req, res, next) => {
  try {
    const listAccount = await adminService.getListUsers();
    const response = apiResponse.success(listAccount, "Get list success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getListRecruiter = async (req, res, next) => {
  try {
    const listRecruiter = await adminService.getListRecruiter(
      req.params.companyId
    );
    const response = apiResponse.success(listRecruiter, "Get list success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getAppliedJobList = async (req, res, next) => {
  try {
    const findAccountApplied = await candidateService.getAppliedJobs(
      req.params.userId
    );
    const response = apiResponse.success(
      findAccountApplied,
      "Get job applied success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

//! Update User
export const updateUser = async (req, res, next) => {
  try {
    const { user, avatarUploadError } = await candidateService.updateProfile(
      req.user._id,
      req.body,
      req.file
    );
    const response = apiResponse.success(user, "Update successfully");
    if (avatarUploadError) {
      return res.status(response.status).json({
        ...response.body,
        avatarUploadError,
      });
    }
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const generateImproveText = async (req, res, next) => {
  try {
    const result = await candidateService.generateImproveText(
      req.body.field,
      req.body.content
    );
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error("Lỗi khi tạo nội dung cải thiện:", err.message);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo nội dung cải thiện",
      error: err.message,
    });
  }
};

// ! Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const deleteUser = await candidateService.deleteAccount(req.user._id);
    await Promise.all([comment.deleteOne({ _id: req.user._id })]);
    const response = apiResponse.success(
      deleteUser,
      "User account delete successful"
    );
    res.status(response.status).json(response.body);
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
