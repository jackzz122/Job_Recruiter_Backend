import { apiResponse } from "../helper/response.helper.js";
import reportModel from "../models/reports.model.js";
export const getReportList = async (req, res, next) => {
  try {
    const reportList = await reportModel.find({});
    if (reportList.length === 0) {
      const response = apiResponse.notFoundList("No report list founded");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(
      reportList,
      "List founded successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const createReport = async (req, res, next) => {
  try {
    const newReport = new reportModel({
      ...req.body,
      accountId: req.user._id,
    });
    const response = apiResponse.created(newReport, "Report has been sent");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const updateReportStatus = (req, res, next) => {};
export const deleteReportInfo = async (req, res, next) => {
  try {
    const findReport = await reportModel.deleteOne({ id: req.params.reportId });
    if (findReport.deletedCount === 0) {
      const response = apiResponse.notFound("Not found your report");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(findReport, "Delete success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
