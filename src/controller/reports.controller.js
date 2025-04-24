import { apiResponse } from "../helper/response.helper.js";
import reportModel from "../models/reports.model.js";
export const getReportList = async (req, res, next) => {
  try {
    const reportList = await reportModel
      .find({})
      .populate("accountId", "fullname email avatarIMG")
      .populate("target_id", "fullname email")
      .populate("reportTarget")
      .lean();
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
    const findReport = await reportModel.findOne({
      reportTarget: req.body.reportTarget,
    });
    if (findReport) {
      const response = apiResponse.badRequest("You has already report this");
      return res.status(response.status).json(response.body);
    }
    const newReport = new reportModel({
      ...req.body,
      accountId: req.user._id,
    });
    await newReport.save();
    const response = apiResponse.created(newReport, "Report has been sent");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const updateReportStatus = async (req, res, next) => {
  try {
    const findReport = await reportModel.findOne({ _id: req.params.reportId });
    if (!findReport) {
      const response = apiResponse.notFound("Not found report");
      return res.status(response.status).json(response.body);
    }
    findReport.status = req.body.status;
    await findReport.save();
    const response = apiResponse.success(findReport, "Success change status");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
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
