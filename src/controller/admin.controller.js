import { apiResponse } from "../helper/response.helper.js";
import adminService from "../services/admin.service.js";
export const getListCandidateAccount = (req, res, next) => {};

export const getListRecruiterAccount = (req, res, next) => {};

export const deleteAccount = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const deletedAccount = await adminService.deleteAccount(accountId);
    const response = apiResponse.success(
      deletedAccount,
      "Account deleted successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const blockedAccount = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const blockedAccount = await adminService.blockedAccount(accountId);
    const response = apiResponse.success(
      blockedAccount,
      "Account blocked successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const blockedCompanyAccount = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const blockedCompany = await adminService.blockedCompanyAccount(companyId);
    const response = apiResponse.success(
      blockedCompany,
      "Company blocked successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const unBlockedCompanyAccount = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const unBlockedCompany = await adminService.unBlockedCompanyAccount(
      companyId
    );
    const response = apiResponse.success(
      unBlockedCompany,
      "Company unblocked successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const deleteUserAccount = async (req, res, next) => {};
export const deleteCompanyAccount = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const deletedCompany = await adminService.deleteCompanyAccount(companyId);
    const response = apiResponse.success(
      deletedCompany,
      "Company deleted successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const getListRecruiterCompanyAccount = async (req, res, next) => {
  try {
    const listRecruiterCompanyAccount =
      await adminService.getListRecruiterCompanyAccount();
    const response = apiResponse.success(
      listRecruiterCompanyAccount,
      "List recruiter company account successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const approveAccount = async (req, res, next) => {
  try {
    const accountId = req.params.accountId;
    const approveAccount = await adminService.approveAccount(accountId);
    const response = apiResponse.success(
      approveAccount,
      "Account approved successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
