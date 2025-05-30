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

export const getDetailsReport = async (req, res, next) => {
  try {
    const report = await reportService.getDetailsReport(req.params.reportId);
    const response = apiResponse.success(report, "Report found successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const changeStatusReportItem = async (req, res, next) => {
  try {
    console.log(req.body);
    const updatedReport = await reportService.updateStatusReportItem(
      req.body.id,
      req.body.targetType,
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
export const deleteReportItem = async (req, res, next) => {
  try {
    const deletedReport = await reportService.deleteReportItem(
      req.body.reportId,
      req.body.targetType,
      req.body.reportTarget
    );
    const response = apiResponse.success(deletedReport, "Delete success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
