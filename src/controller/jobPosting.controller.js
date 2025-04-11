import jobPosting from "../models/jobPosting.model.js";
import { apiResponse } from "../helper/response.helper.js";
// export const getAllJobPostings = async (req, res, next) => {
//   try {
//     const jobPostingList = await jobPosting.find();
//     if (!jobPostingList)
//       return res
//         .status(404)
//         .json({ message: "JobPosting not found in any company" });
//     return res.json({ list: jobPostingList });
//   } catch (err) {
//     next(err);
//   }
// };

export const getJobPostingList = async (req, res, next) => {
  try {
    const company_Id = req.user.companyId;
    const jobPostingList = await jobPosting.find({ companyId: company_Id });
    if (jobPostingList.length === 0) {
      const response = apiResponse.notFoundList("No job posting found");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(
      jobPostingList,
      "job list get success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getPostingDetails = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const findJobPosting = await jobPosting.findOne({ _id: jobId });
    if (!findJobPosting) {
      const response = apiResponse.notFound("Job posting not found");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(findJobPosting, "Get Job success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createJobPosting = async (req, res, next) => {
  try {
    const user_Id = req.user._id;
    const company_Id = req.user.companyId;
    const newJobPosting = new jobPosting({
      ...req.body,
      accountId: user_Id,
      companyId: company_Id,
    });
    await newJobPosting.save();
    const response = apiResponse.created(
      newJobPosting,
      "create job posting successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const updateJobPosting = async (req, res, next) => {
  try {
    const jobPostingId = req.params.jobPostingId;
    const jobPostingDetail = jobPosting.findOne({ _id: jobPostingId });
    if (jobPostingDetail) {
      const response = apiResponse.error("Job posting not found");
      return res.status(response.status).json(response.body);
    }
    Object.assign(jobPostingDetail, req.body);
    await jobPostingDetail.save();
    const response = apiResponse.success(
      jobPostingDetail,
      "Update job successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deleteJobPosting = async (req, res, next) => {
  try {
    const id = req.params.jobPostingId;
    const findJob = await jobPosting.deleteOne({ _id: id });
    if (findJob.deletedCount === 0)
      return res.status(404).json({ message: "Job posting not foundede" });
    return res.json({ message: "Job posting deleted" });
  } catch (err) {
    next(err);
  }
};
