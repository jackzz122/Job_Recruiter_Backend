import company from "../models/companyInfor.model.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
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
    return res.status(201).json({ message: "Company created successfully" });
  } catch (err) {
    next(err);
  }
};
export const updateCompanyInfo = async (req, res, next) => {
  try {
    const companyId = req.companyId;
    const findCompany = await company.find({ _id: companyId });
    if (findCompany.length === 0)
      return res.status(404).json({ message: "Company not founded" });
    Object.assign(findCompany, req.body);
    await findCompany.save();
    return res.json({ message: "Updated successfully" });
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
    return res
      .status(201)
      .json({ status: "success", message: "Create account success" });
  } catch (err) {
    next(err);
  }
};

export const deleteAccountStaff = async (req, res, next) => {
  try {
    console.log("Nice");
    const findAccount = await account.findOne({ _id: req.params.userId });
    console.log(findAccount);
    if (!findAccount) {
      return res.status(404).json({ message: "Account not found" });
    }
    return res.json({ message: "Delete successfully" });
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
