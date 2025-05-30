import account, { statusAccount } from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import { status } from "../models/pendingApprove.js";
import { sendMailService } from "../services/EmailService.js";
import jobPosting from "../models/jobPosting.model.js";
import comments from "../models/comments.model.js";
import report from "../models/reports.model.js";

class adminService {
  async getListUsers() {
    const listAccount = await account.find({}, { password: 0 });
    if (!listAccount) {
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
    try {
      // Find the account first to check role
      const findAccount = await account.findById(accountId);
      if (!findAccount) {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }

      // If account is a recruiter, use deleteCompanyAccount logic
      if (findAccount.role === RoleName.Recruit && findAccount.companyId) {
        // Delete related job postings and check result
        const deletedJobs = await jobPosting.deleteMany({
          companyId: findAccount.companyId,
        });
        if (!deletedJobs.acknowledged) {
          throw new Error("Failed to delete job postings");
        }

        // Delete related comments and check result
        const deletedComments = await comments.deleteMany({
          company_id: findAccount.companyId,
        });
        if (!deletedComments.acknowledged) {
          throw new Error("Failed to delete comments");
        }

        // Delete related reports and check result
        const deletedReports = await report.deleteMany({
          reportTarget: findAccount.companyId,
          target_type: "companyInfo",
        });
        if (!deletedReports.acknowledged) {
          throw new Error("Failed to delete reports");
        }

        // Only delete company if all related data was deleted successfully
        const deletedCompany = await company.deleteOne({
          _id: findAccount.companyId,
        });
        if (!deletedCompany.deletedCount) {
          const error = new Error("Company not found");
          error.status = 404;
          throw error;
        }

        // Delete the recruiter account
        const deletedAccount = await account.deleteOne({ _id: accountId });
        if (!deletedAccount.deletedCount) {
          throw new Error("Failed to delete recruiter account");
        }

        // Return success response with deletion counts
        return {
          success: true,
          message:
            "Recruiter account, company and related data deleted successfully",
          deletedCounts: {
            account: deletedAccount.deletedCount,
            jobs: deletedJobs.deletedCount,
            comments: deletedComments.deletedCount,
            reports: deletedReports.deletedCount,
            company: deletedCompany.deletedCount,
          },
        };
      }

      // Delete related comments for non-recruiter accounts
      const deletedComments = await comments.deleteMany({
        account_id: accountId,
      });
      if (!deletedComments.acknowledged) {
        throw new Error("Failed to delete comments");
      }

      // If not a recruiter, just delete the account
      const deletedAccount = await account.deleteOne({ _id: accountId });
      if (!deletedAccount.deletedCount) {
        const error = new Error("Failed to delete account");
        error.status = 404;
        throw error;
      }

      return {
        success: true,
        message: "Account deleted successfully",
        deletedCounts: {
          account: deletedAccount.deletedCount,
          comments: deletedComments.deletedCount,
        },
      };
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }
  async getListRecruiter(companyId) {
    const listRecruiter = await account.find({
      role: RoleName.STAFF_RECRUIT,
      companyId: companyId,
    });
    if (!listRecruiter) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }
    return listRecruiter;
  }
  async blockedCompanyAccount(companyId) {
    const findCompany = await company.findById(companyId);
    const findAccount = await account.findOne({ companyId: companyId });
    if (!findCompany) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }
    if (!findAccount) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    findCompany.status = status.BLOCKED;
    await findCompany.save();
    findAccount.statusAccount = statusAccount.BLOCKED;
    await findAccount.save();
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
    const findAccount = await account.findOne({ companyId: companyId });
    if (!findCompany) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }
    findCompany.status = status.APPROVE;
    await findCompany.save();
    if (!findAccount) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    findAccount.statusAccount = statusAccount.APPROVE;
    await findAccount.save();
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
    if (!recruiterAccount) {
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

    if (!filteredResults) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }

    return filteredResults;
  }
  async deleteUserAccount(accountId) {
    try {
      // Find the account first to check role
      const findAccount = await account.findById(accountId);
      if (!findAccount) {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }

      // If account is a recruiter, use deleteCompanyAccount logic
      if (findAccount.role === RoleName.Recruit && findAccount.companyId) {
        // Find and update the account first
        findAccount.role = RoleName.GUEST;
        findAccount.companyId = null;
        await findAccount.save();

        // Delete related job postings and check result
        const deletedJobs = await jobPosting.deleteMany({
          companyId: findAccount.companyId,
        });
        if (!deletedJobs.acknowledged) {
          throw new Error("Failed to delete job postings");
        }

        // Delete related comments and check result
        const deletedComments = await comments.deleteMany({
          company_id: findAccount.companyId,
        });
        if (!deletedComments.acknowledged) {
          throw new Error("Failed to delete comments");
        }

        // Delete related reports and check result
        const deletedReports = await report.deleteMany({
          reportTarget: findAccount.companyId,
          target_type: "companyInfo",
        });
        if (!deletedReports.acknowledged) {
          throw new Error("Failed to delete reports");
        }

        // Only delete company if all related data was deleted successfully
        const deletedCompany = await company.deleteOne({
          _id: findAccount.companyId,
        });
        if (!deletedCompany.deletedCount) {
          const error = new Error("Company not found");
          error.status = 404;
          throw error;
        }

        // Return success response with deletion counts
        return {
          success: true,
          message: "Account, company and related data deleted successfully",
          deletedCounts: {
            jobs: deletedJobs.deletedCount,
            comments: deletedComments.deletedCount,
            reports: deletedReports.deletedCount,
            company: deletedCompany.deletedCount,
            accountUpdated: true,
          },
        };
      }

      // If not a recruiter, just delete the account
      const deletedAccount = await account.deleteOne({ _id: accountId });
      if (!deletedAccount.deletedCount) {
        const error = new Error("Failed to delete account");
        error.status = 404;
        throw error;
      }

      return {
        success: true,
        message: "Account deleted successfully",
        deletedCounts: {
          account: deletedAccount.deletedCount,
        },
      };
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }
  async deleteCompanyAccount(companyId) {
    try {
      // Find and update the account first
      const findAccount = await account.findOne({ companyId: companyId });
      if (findAccount) {
        findAccount.role = RoleName.GUEST;
        findAccount.companyId = null;
        await findAccount.save();
      }

      // Delete related job postings and check result
      const deletedJobs = await jobPosting.deleteMany({ companyId: companyId });
      if (!deletedJobs.acknowledged) {
        throw new Error("Failed to delete job postings");
      }

      // Delete related comments and check result
      const deletedComments = await comments.deleteMany({
        company_id: companyId,
      });
      if (!deletedComments.acknowledged) {
        throw new Error("Failed to delete comments");
      }

      // Delete related reports and check result
      const deletedReports = await report.deleteMany({
        reportTarget: companyId,
        target_type: "companyInfo",
      });
      if (!deletedReports.acknowledged) {
        throw new Error("Failed to delete reports");
      }

      // Only delete company if all related data was deleted successfully
      const deletedCompany = await company.deleteOne({ _id: companyId });
      if (!deletedCompany.deletedCount) {
        const error = new Error("Company not found");
        error.status = 404;
        throw error;
      }

      // Return success response with deletion counts
      return {
        success: true,
        message: "Company and related data deleted successfully",
        deletedCounts: {
          jobs: deletedJobs.deletedCount,
          comments: deletedComments.deletedCount,
          reports: deletedReports.deletedCount,
          company: deletedCompany.deletedCount,
          accountUpdated: findAccount ? true : false,
        },
      };
    } catch (error) {
      // If any deletion fails, throw an error
      error.status = error.status || 500;
      throw error;
    }
  }
}

export default new adminService();
