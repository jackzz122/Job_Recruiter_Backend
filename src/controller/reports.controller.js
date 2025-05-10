import { apiResponse } from "../helper/response.helper.js";
import reportService from "../services/reports.service.js";

export const getReportList = async (req, res, next) => {
  try {
    const reportList = await reportService.getReportList();
    const response = apiResponse.success(reportList, "List found successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createReport = async (req, res, next) => {
  try {
    const newReport = await reportService.createReport(req.body, req.user._id);
    const response = apiResponse.created(newReport, "Report has been sent");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const updateReportStatus = async (req, res, next) => {
  try {
    const updatedReport = await reportService.updateReportStatus(
      req.params.reportId,
      req.body.status
    );
    const response = apiResponse.success(
      updatedReport,
      "Success change status"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deleteReportInfo = async (req, res, next) => {
  try {
    await reportService.deleteReportInfo(req.params.reportId);
    const response = apiResponse.success(null, "Delete success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
