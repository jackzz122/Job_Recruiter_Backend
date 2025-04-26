import account from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import jobPosting from "../models/jobPosting.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as _ from "lodash";
import pendingApprove from "../models/pendingApprove.js";
import { RoleName } from "../models/account.model.js";
import { validateRequest } from "../services/validateRequest.js";
import comment from "../models/comments.model.js";
import cloudinary from "../utils/cloudinary.js";
import { apiResponse } from "../helper/response.helper.js";
import fs from "fs/promises";
const maxAge = 3 * 24 * 60 * 60;
const createToken = (user) => {
  return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

export const comparePassword = async (password, hasPash) => {
  return await bcrypt.compare(password, hasPash);
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
    const response = apiResponse.success("Register successfully");
    return res.status(response.status).json(response.body);
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

export const changePassword = async (req, res, next) => {
  try {
    const findUser = await account.findOne({ _id: req.user._id });
    if (!findUser) {
      const response = apiResponse.notFound("Not found your account");
      return res.status(response.status).json(response.body);
    }
    const { oldPassword, newPassword } = req.body;
    const isMatch = await comparePassword(oldPassword, findUser.password);
    if (!isMatch) {
      const response = apiResponse.badRequest("Your old password is wrong");
      return res.status(response.status).json(response.body);
    }
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(newPassword, saltRounds);
    findUser.password = hashPass;
    await findUser.save();
    const { password, ...currentUser } = findUser.toObject();
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

export const loginForUser = async (req, res, next) => {
  try {
    const { isValid, errors, validData } = validateRequest(req);
    if (!isValid) {
      return res.status(400).json(errors);
    }
    const data = validData;
    const findUser = await account.findOne({ email: data.email });
    if (!findUser) {
      return res.status(404).json({ message: "Account not found" });
    }
    const isMatch = await comparePassword(data.password, findUser.password);
    if (!isMatch) {
      return res
        .status(404)
        .json({ message: "Email or password was incorrect" });
    }
    const roleGroup = req.body.roleGroup;
    if (!Array.isArray(roleGroup) || !roleGroup.includes(findUser.role)) {
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
    if (findAccount.role === RoleName.STAFF_RECRUIT) {
      return res.status(403).json({
        message:
          "You are not authorized to register this, please contact to our page",
      });
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
      const response = apiResponse.notFound("User not found");
      return res.status(response.status).json(response.body);
    }
    let query = account.findOne({ _id: req.user._id });
    if (
      req.user.role === RoleName.Recruit ||
      req.user.role === RoleName.STAFF_RECRUIT
    ) {
      query = query.populate("companyId");
    } else if (req.user.role === RoleName.GUEST) {
      query = query
        .populate({
          path: "listFavouritesCompanyID",
          select: "companyName country address logo",
        })
        .populate({
          path: "listFavouritesJobsID",
          select:
            "title minRange maxRange location startDate applicationDeadline",
          populate: {
            path: "companyId",
            select: "companyName",
          },
        });
    }
    const findUser = await query.lean();
    if (!findUser) {
      return res.status(404).json({ message: "User not found in database" });
    }
    const { password, ...currentUser } = findUser;
    const response = apiResponse.success(currentUser, "Get user success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getListUsers = async (req, res, next) => {
  try {
    const listAccount = await account.find({}, { password: 0 });
    if (listAccount.length === 0) {
      const response = apiResponse.notFoundList("Not found any list users");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(listAccount, "Get list success");
    return res.status(response.status).json(response.body);
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
    if (listRecruiter.length === 0) {
      const response = apiResponse.notFoundList("Not found any list users");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(listRecruiter, "Get list success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
//! Update User
export const updateUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const response = await apiResponse.notFound("Not found your account");
      return res.status(response.status).json(response.body);
    }
    let avatarUploadError = null;
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "avatar",
        });
        findUser.avatarIMG = result.secure_url;
        await fs.unlink(filePath);
      } catch (err) {
        console.log(err);
        avatarUploadError = "Có lỗi khi tải ảnh lên. Vui lòng thử lại!";
      }
    }
    if (req.body) {
      const arrayFields = [
        "education",
        "certificate",
        "projects",
        "workEx",
        "skills",
      ];
      Object.entries(req.body).forEach(([key, value]) => {
        if (arrayFields.includes(key)) {
          if (value._id) {
            const index = findUser[key].findIndex(
              (item) => item._id.toString() === value._id
            );

            if (index !== -1) {
              const hasOnlyId = Object.keys(value).length === 1;
              if (hasOnlyId) {
                findUser[key].splice(index, 1);
              } else {
                const { _id, ...bodyValue } = value;
                console.log(bodyValue);
                findUser[key][index] = { ...findUser[key][index], ...value };
              }
            }
          } else findUser[key].push(value);
        } else {
          findUser[key] = value;
        }
      });
    }
    await findUser.save();
    const response = apiResponse.success(findUser, "Update successfully");
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

// ! Delete user
export const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const deleteUser = await account.findOneAndDelete({ _id: userId });
    if (!deleteUser) {
      const response = apiResponse.notFound("Delete your account error");
      return response.status(response.status).json(response.body);
    }
    await Promise.all([comment.deleteOne({ _id: userId })]);
    const response = apiResponse.success(
      deleteUser,
      "User account delete successfull"
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

// ! Company Favourite
export const companyFavourite = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const companyId = req.params.companyId;
    const findCompany = await company.findOne({ _id: companyId });
    if (!findCompany) {
      const response = apiResponse.notFound("Not found company");
      return res.status(response.status).json(response.body);
    }
    const findUser = await account.findById(userId);
    if (!findUser) {
      const response = apiResponse.notFound("Not found user");
      return res.status(response.status).json(response.body);
    }
    if (!findUser.listFavouritesCompanyID.includes(companyId)) {
      findUser.listFavouritesCompanyID.push(companyId);
      await findUser.save();
    }
    const response = apiResponse.success(
      findUser.listFavouritesCompanyID,
      "Add favourite company success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
// ! Remove company Favourite
export const removeFavouriteCompany = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const companyId = req.params.companyId;

    const findCompany = await company.findById(companyId);
    if (!findCompany) {
      const response = apiResponse.notFound("Not found company");
      return res.status(response.status).json(response.body);
    }
    const findUser = await account.findById(userId);
    if (!findUser) {
      const response = apiResponse.notFound("Not found user");
      return res.status(response.status).json(response.body);
    }
    findUser.listFavouritesCompanyID = findUser.listFavouritesCompanyID.filter(
      (id) => id.toString() !== companyId
    );
    await findUser.save();
    const response = apiResponse.success(
      findUser.listFavouritesCompanyID,
      "Remove favourite company success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

// ! Job Favourite
export const jobFavourite = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.jobPostingId;

    const findJobPosting = await jobPosting.findById(jobId);
    if (!findJobPosting) {
      const response = apiResponse.notFound("Not found job posting");
      return res.status(response.status).json(response.body);
    }
    const findUser = await account.findById(userId);
    if (!findUser) {
      const response = apiResponse.notFound("Not found user");
      return res.status(response.status).json(response.body);
    }
    if (!findUser.listFavouritesJobsID.includes(jobId)) {
      findUser.listFavouritesJobsID.push(jobId);
      await findUser.save();
    }
    const response = apiResponse.success(
      findUser.listFavouritesJobsID,
      "Add job to favourites success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
// ! Remove Job Favourite
export const removeFavouriteJob = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const jobId = req.params.jobPostingId;
    const findJobPosting = await jobPosting.findById(jobId);
    if (!findJobPosting) {
      const response = apiResponse.notFound("Not found job posting");
      return res.status(response.status).json(response.body);
    }
    const findUser = await account.findById(userId);
    if (!findUser) {
      const response = apiResponse.notFound("Not found user");
      return res.status(response.status).json(response.body);
    }
    findUser.listFavouritesJobsID = findUser.listFavouritesJobsID.filter(
      (id) => id.toString() !== jobId
    );
    await findUser.save();
    const response = apiResponse.success(
      findUser.listFavouritesJobsID,
      "Removed job from favourites"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
