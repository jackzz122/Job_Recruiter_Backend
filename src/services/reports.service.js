import reportModel, { Status } from "../models/reports.model.js";
import { TargetType } from "../models/reports.model.js";
import jobPostingModel from "../models/jobPosting.model.js";
import commentModel from "../models/comments.model.js";
import companyModel from "../models/companyInfor.model.js";
import { sendMailService } from "./EmailService.js";
class reportService {
  async getReportList() {
    const reportList = await reportModel
      .find({})
      .populate("accountId", "fullname email avatarIMG")
      .populate("target_id", "fullname email")
      .populate("reportTarget")
      .lean();

    if (!reportList) {
      const error = new Error("No report list found");
      error.status = 404;
      throw error;
    }
    return reportList;
  }
  async getDetailsReport(reportId) {
    const findReport = await reportModel
      .findOne({
        _id: reportId,
      })
      .populate("accountId", "fullname email")
      .populate("target_id", "fullname email");
    if (!findReport) {
      const error = new Error("Report not found");
      error.status = 404;
      throw error;
    }

    switch (findReport.target_type) {
      case TargetType.JOB:
        const jobPosting = await jobPostingModel
          .findOne({
            _id: findReport.reportTarget,
          })
          .select("title sizingPeople minRange maxRange")
          .populate("companyId", "companyName");
        return {
          report: findReport,
          reportContent: jobPosting,
          targetType: findReport.target_type,
        };
      case TargetType.COMPANY:
        const company = await companyModel
          .findOne({
            _id: findReport.reportTarget,
          })
          .select("companyName country phoneNumberCompany")
          .populate("accountID", "fullname email");
        return {
          report: findReport,
          reportContent: company,
          targetType: findReport.target_type,
        };
      case TargetType.COMMENT:
        const comment = await commentModel
          .findOne({
            _id: findReport.reportTarget,
          })
          .select("title details")
          .populate("account_id", "fullname email");
        return {
          report: findReport,
          reportContent: comment,
          targetType: findReport.target_type,
        };
      default:
        const error = new Error("Invalid report type");
        error.status = 400;
        throw error;
    }
  }
  async createReport(data, userId) {
    const findReport = await reportModel.findOne({
      accountId: userId,
      reportTarget: data.reportTarget,
    });

    if (findReport) {
      const error = new Error("You have already reported this");
      error.status = 400;
      throw error;
    }

    const newReport = new reportModel({
      ...data,
      accountId: userId,
    });
    await newReport.save();
    return newReport;
  }
  async updateStatusReportItem(id, targetType, status) {
    if (targetType === TargetType.JOB) {
      const findJob = await jobPostingModel.findOne({ _id: id });
      if (!findJob) {
        const error = new Error("Job not found");
        error.status = 404;
        throw error;
      }
      findJob.status = status;
      await findJob.save();
      return findJob;
    }

    if (targetType === TargetType.COMMENT) {
      const findComment = await commentModel.findOne({ _id: id });
      if (!findComment) {
        const error = new Error("Comment not found");
        error.status = 404;
        throw error;
      }
      findComment.status = status;
      await findComment.save();
      return findComment;
    }
  }
  async updateReportStatus(reportId, status) {
    const findReport = await reportModel
      .findOne({ _id: reportId })
      .populate("accountId", "email")
      .populate("target_id", "email");
    console.log(findReport);
    if (!findReport) {
      const error = new Error("Report not found");
      error.status = 404;
      throw error;
    }

    findReport.status = status;
    await findReport.save();

    if (status === Status.RESOLVED) {
      // Send email to reporter
      await sendMailService(
        "admin@admin.com",
        "Report Approved",
        "Your report has been approved",
        findReport.accountId.email,
        "Your report has been reviewed and approved. The reported content has been removed."
      );

      // Send email to reported person
      await sendMailService(
        "admin@admin.com",
        "Content Removed",
        "Your content has been removed due to violation",
        findReport.target_id.email,
        "Your content has been removed due to violation of our community guidelines."
      );
    } else if (status === Status.REJECTED) {
      // Send email to reporter
      await sendMailService(
        "admin@admin.com",
        "Report Rejected",
        "Your report has been rejected",
        findReport.accountId.email,
        "Your report has been reviewed and rejected. The reported content does not violate our community guidelines."
      );
    }

    return findReport;
  }

  async deleteReportInfo(reportId) {
    const findReport = await reportModel.deleteOne({ _id: reportId });
    if (findReport.deletedCount === 0) {
      const error = new Error("Report not found");
      error.status = 404;
      throw error;
    }
    return true;
  }
  async deleteReportItem(reportId, targetType, reportTarget) {
    try {
      // Start a session for transaction
      const session = await reportModel.startSession();
      let result;

      await session.withTransaction(async () => {
        // Delete the report
        const report = await reportModel.deleteOne(
          { _id: reportId },
          { session }
        );
        if (report.deletedCount === 0) {
          throw new Error("Report not found");
        }

        // Delete the target item based on type
        switch (targetType) {
          case TargetType.JOB:
            // First delete the job posting
            const findJob = await jobPostingModel.deleteOne(
              { _id: reportTarget },
              { session }
            );
            if (findJob.deletedCount === 0) {
              throw new Error("Job not found");
            }

            // Then delete all reports targeting the same job
            const deletedReports = await reportModel.deleteMany(
              {
                reportTarget: reportTarget,
                target_type: TargetType.JOB,
                _id: { $ne: reportId }, // Exclude the already deleted report
              },
              { session }
            );

            result = {
              type: "job",
              deleted: true,
              jobDeleted: true,
              additionalReportsDeleted: deletedReports.deletedCount,
            };
            break;

          case TargetType.COMMENT:
            const findComment = await commentModel.deleteOne(
              { _id: reportTarget },
              { session }
            );
            if (findComment.deletedCount === 0) {
              throw new Error("Comment not found");
            }
            result = { type: "comment", deleted: true };
            break;
          case TargetType.COMPANY:
            return { type: "company", deleted: true };
          default:
            throw new Error("Invalid target type");
        }
      });

      return result;
    } catch (error) {
      error.status = error.status || 500;
      throw error;
    }
  }
}

export default new reportService();
