import account, { statusAccount } from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import { status } from "../models/pendingApprove.js";
import { sendMailService } from "../services/EmailService.js";

class adminService {
  async getListUsers() {
    const listAccount = await account.find({}, { password: 0 });
    if (listAccount.length === 0) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }
    return listAccount;
  }
  async blockedAccount(accountId) {
    const findAccount = await account.findById(accountId);
    if (!findAccount) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    findAccount.statusAccount = statusAccount.BLOCKED;
    await findAccount.save();
    return findAccount;
  }
  async approveAccount(accountId) {
    const findAccount = await account.findById(accountId);
    if (!findAccount) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    findAccount.statusAccount = statusAccount.APPROVE;
    await findAccount.save();
    return findAccount;
  }
  async deleteAccount(accountId) {
    const deletedAccount = await account.deleteOne({ _id: accountId });
    if (!deletedAccount.deletedCount) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    return deletedAccount;
  }
  async getListRecruiter(companyId) {
    const listRecruiter = await account.find({
      role: RoleName.STAFF_RECRUIT,
      companyId: companyId,
    });
    if (listRecruiter.length === 0) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }
    return listRecruiter;
  }
  async blockedCompanyAccount(companyId) {
    const findCompany = await company.findById(companyId);
    if (!findCompany) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }
    findCompany.status = status.BLOCKED;
    await findCompany.save();

    // Send notification email
    await sendMailService(
      "admin@admin.com",
      "Account Blocked",
      "Your company account has been blocked by admin",
      findCompany.email,
      "Your company account has been blocked. Please contact admin for more information."
    );

    return findCompany;
  }
  async unBlockedCompanyAccount(companyId) {
    const findCompany = await company.findById(companyId);
    if (!findCompany) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }
    findCompany.status = status.APPROVE;
    await findCompany.save();

    // Send notification email
    await sendMailService(
      "admin@admin.com",
      "Account Unblocked",
      "Your company account has been unblocked by admin",
      findCompany.email,
      "Your company account has been unblocked. You can now access your account normally."
    );

    return findCompany;
  }
  async getListRecruiterCompanyAccount() {
    const recruiterAccount = await account.find({
      role: RoleName.Recruit,
    });
    if (recruiterAccount.length === 0) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }

    const companyRecruiter = await Promise.all(
      recruiterAccount.map(async (item) => {
        const companyInfo = await company.findOne({ _id: item.companyId });
        if (!companyInfo) return null;

        return {
          _id: companyInfo._id,
          avatarIMG: item.avatarIMG,
          name: item.fullname,
          companyName: companyInfo.companyName,
          email: item.email,
          status: companyInfo.status,
          phone: item.phone,
          createdAt: companyInfo.createdAt,
        };
      })
    );

    const filteredResults = companyRecruiter.filter((item) => item !== null);

    if (filteredResults.length === 0) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }

    return filteredResults;
  }
}

export default new adminService();
