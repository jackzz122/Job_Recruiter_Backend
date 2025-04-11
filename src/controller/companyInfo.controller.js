import company from "../models/companyInfor.model.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import { apiResponse } from "../helper/response.helper.js";
export const getCompanyInfo = async (req, res, next) => {
  try {
    const id = req.params.companyId;
    const companyRes = await company.find({ _id: id });
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
export const updateCompanyInfo = async (req, res, next) => {
  try {
    const companyId = req.companyId;
    const findCompany = await company.findOne({ _id: companyId });
    if (!findCompany) {
      const response = apiResponse.notFound("Not found company");
      return res.status(response.status).json(response.body);
    }
    Object.assign(findCompany, req.body);
    await findCompany.save();
    const response = apiResponse.success(findCompany, "Updated successfully");
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
