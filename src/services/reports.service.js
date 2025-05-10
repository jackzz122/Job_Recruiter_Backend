import reportModel from "../models/reports.model.js";

class reportService {
  async getReportList() {
    const reportList = await reportModel
      .find({})
      .populate("accountId", "fullname email avatarIMG")
      .populate("target_id", "fullname email")
      .populate("reportTarget")
      .lean();

    if (reportList.length === 0) {
      const error = new Error("No report list found");
      error.status = 404;
      throw error;
    }
    return reportList;
  }

  async createReport(data, userId) {
    const findReport = await reportModel.findOne({
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

  async updateReportStatus(reportId, status) {
    const findReport = await reportModel.findOne({ _id: reportId });
    if (!findReport) {
      const error = new Error("Report not found");
      error.status = 404;
      throw error;
    }

    findReport.status = status;
    await findReport.save();
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
}

export default new reportService();
