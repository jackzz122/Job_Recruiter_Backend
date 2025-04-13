import company from "../models/companyInfor.model.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import pendingApprove from "../models/pendingApprove.js";
import { apiResponse } from "../helper/response.helper.js";
export const getCompanyInfo = async (req, res, next) => {
  try {
    console.log("Nice one123123");
    const companyRes = await company.find({ _id: req.params.id });
    if (companyRes.length === 0)
      return res.status(404).json({ message: "Company not found" });
    return res.json(companyRes);
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
export const updateCompanyInformation = async (req, res, next) => {
  try {
    // Không cần session nữa
    const companyDetail = await company.findOne({ _id: req.params.companyId });

    if (!companyDetail) {
      const response = apiResponse.error("Company not found");
      return res.status(response.status).json(response.body);
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
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createAccountStaff = async (req, res, next) => {
  try {
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
