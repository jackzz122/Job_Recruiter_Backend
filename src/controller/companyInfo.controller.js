import company from "../models/companyInfor.model.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import pendingApprove from "../models/pendingApprove.js";
import { apiResponse } from "../helper/response.helper.js";
import bcrypt from "bcrypt";
import cloudinary from "../utils/cloudinary.js";
import jobPostingModel, {
  statusApplications,
} from "../models/jobPosting.model.js";
import { sendMailService } from "../services/EmailService.js";
export const getCompanyList = async (req, res, next) => {
  try {
    const companyList = await company.find({});
    if (companyList.length === 0) {
      const response = apiResponse.notFoundList("Not found any company list");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(companyList, "Get list success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getCompanyInfo = async (req, res, next) => {
  try {
    const companyRes = await company.findOne({ _id: req.params.id });
    if (companyRes.length === 0) {
      const response = apiResponse.notFound("Not found Company");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(companyRes, "Get company success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createCompanyInfo = async (req, res, next) => {
  try {
    const accountRes = await account.findOne({ _id: accountID });
    const newCompany = new company({
      ...req.body,
    });
    await newCompany.save();
    accountRes.role = RoleName.STAFF;
    accountRes.companyId = newCompany._id;
    await accountRes.save();
    const response = apiResponse.created(
      newCompany,
      "Company Created successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const changeStatus = async (req, res, next) => {
  try {
    const findUserApplied = await jobPostingModel.findOne({
      _id: req.body.jobId,
    });
    if (!findUserApplied) {
      const response = apiResponse.notFound("Not found job posting");
      return res.status(response.status).json(response.body);
    }
    const getUser = findUserApplied.listAccount.find((account) => {
      return account.accountId.toString() === req.params.userId;
    });
    getUser.status = req.body.status;
    await findUserApplied.save();
    if (req.body.status === statusApplications.Success) {
      console.log("Email send");
      await sendMailService(
        req.body.ownerMail,
        "Hi friend",
        "Front your web you have a new application",
        req.body.receiveMail,
        "Your application was successful!"
      );
    }
    if (req.body.status === statusApplications.Rejected) {
      console.log("Email send");
      await sendMailService(
        req.body.ownerMail,
        "You are being Rejected",
        "Thanks for spent time for our",
        req.body.receiveMail,
        "So so sory!"
      );
    }

    const response = apiResponse.success(getUser, "Update success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const updateCompanyInformation = async (req, res, next) => {
  try {
    const companyDetail = await company.findOne({ _id: req.params.companyId });

    if (!companyDetail) {
      const response = apiResponse.error("Company not found");
      return res.status(response.status).json(response.body);
    }
    let logoError = null;
    if (req.file) {
      try {
        const results = await cloudinary.uploader.upload(req.file.path, {
          folder: "logoCompany",
        });
        companyDetail.logo = results.secure_url;
      } catch (err) {
        console.log(err);
        logoError = "Có vấn đề về upload logo ảnh công ty";
      }
    }
    Object.assign(companyDetail, req.body);
    await companyDetail.save();

    const pendingRecord = await pendingApprove.findOne({
      accountID: companyDetail.accountID,
    });

    if (pendingRecord) {
      pendingRecord.companyName =
        req.body.companyName || pendingRecord.companyName;
      pendingRecord.phoneNumber =
        req.body.phoneNumber || pendingRecord.phoneNumber;
      pendingRecord.address = req.body.address || pendingRecord.address;
      pendingRecord.websiteUrl =
        req.body.websiteUrl || pendingRecord.websiteUrl;
      await pendingRecord.save();
    }
    const response = apiResponse.success(
      companyDetail,
      "Update company information successfully"
    );
    if (logoError) {
      return res.status(response.status).json({
        ...response.body,
        logoError,
      });
    }
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createAccountStaff = async (req, res, next) => {
  try {
    const { password } = req.body;
    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.body.password = hash;
    const newAccountStaff = new account({
      ...req.body,
      role: RoleName.STAFF_RECRUIT,
      companyId: req.body.companyId,
    });
    await newAccountStaff.save();
    const response = apiResponse.created(
      newAccountStaff,
      "Create Account success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deleteAccountStaff = async (req, res, next) => {
  try {
    const deleted = await account.findByIdAndDelete(req.params.userId);
    if (!deleted) {
      const response = apiResponse.notFound("Not found account");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(deleted, "Delete successfullu");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deleteCompanyInfo = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const deletedCompany = await company.deleteOne({ _id: companyId });
    if (deletedCompany.deletedCount === 0) {
      return res.status(404).json({ message: "Company not found" });
    }

    return res.status(200).json({ message: "company deleted" });
  } catch (err) {
    next(err);
  }
};
