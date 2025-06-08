import jobPosting from "../models/jobPosting.model.js";
import { apiResponse } from "../helper/response.helper.js";
import { RoleName } from "../models/account.model.js";
import account from "../models/account.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import jobPostingService from "../services/jobPosting.service.js";
import applicationService from "../services/application.service.js";

export const getCandidateFromJobPosting = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const jobPostingList = await applicationService.getCandidateByJob(
      companyId
    );
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
export const JobPostingSearch = async (req, res, next) => {
  try {
    const filters = {
      experience: req.query.experience
        ? Number(req.query.experience)
        : undefined,
      minSalary: req.query.minSalary ? Number(req.query.minSalary) : undefined,
      maxSalary: req.query.maxSalary ? Number(req.query.maxSalary) : undefined,
      peopleHiring: req.query.peopleHiring
        ? Number(req.query.peopleHiring)
        : undefined,
    };
    console.log(filters);
    const searchResults = await jobPostingService.searchJobs(filters);
    const response = apiResponse.success(
      searchResults,
      "Search jobs successful"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const searchJobPosting = async (req, res, next) => {
  try {
    const searchJobPosting = await jobPostingService.searchJobPosting(
      req.params.jobId
    );
    const response = apiResponse.success(
      searchJobPosting,
      "Search job posting success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const changeStatusJobPosting = async (req, res, next) => {
  try {
    const updatedJobPosting = await jobPostingService.changeStatus(
      req.params.jobId,
      req.body.status
    );
    const response = apiResponse.success(
      updatedJobPosting,
      "Change status job posting success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const getAllJobPosting = async (req, res, next) => {
  try {
    const jobPostingList = await jobPostingService.getAllJobPosting();
    const response = apiResponse.success(
      jobPostingList,
      "job list get success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const getJobPostingList = async (req, res, next) => {
  try {
    const companyId = req.params.companyId;
    const jobPostingList = await jobPostingService.getJobPostingList(companyId);
    if (jobPostingList.length === 0) {
      const response = apiResponse.notFoundList("No job posting found");
      return res.status(response.status).json(response.body);
    }
    console.log(jobPostingList);
    // if (req.user.role === RoleName.GUEST) {
    //   query.populate("companyId", "companyName logo");
    // }
    const response = apiResponse.success(
      jobPostingList,
      "job list get success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const addApplicants = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const inforUserPost = await applicationService.submitApplication(
      userId,
      req.params.jobId,
      req.file,
      req.body.coverLetter,
      req.body.cvLink
    );
    const response = apiResponse.created(inforUserPost, "Applicant successs");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const removeApplicants = async (req, res, next) => {
  try {
    console.log(req.body);
    const findJob = await jobPosting.findOne({ _id: req.body.jobId });
    if (!findJob) {
      const response = apiResponse.notFound("Job posting not found");
      return res.status(response.status).json(response.body);
    }
    const existed = findJob.listAccount.some(
      (acc) => acc.accountId.toString() === req.params.userId
    );

    if (!existed) {
      const response = apiResponse.notFound("Account not found in job posting");
      return res.status(response.status).json(response.body);
    }
    const filterAccount = (findJob.listAccount = findJob.listAccount.filter(
      (account) => account.accountId.toString() !== req.params.userId
    ));
    findJob.listAccount = filterAccount;
    await findJob.save();
    const response = apiResponse.success(
      findJob,
      "Remove account from job posting success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const getPostingDetails = async (req, res, next) => {
  try {
    const getJobPostingDetails = await jobPostingService.getJobPostingById(
      req.params.jobId
    );
    const response = apiResponse.success(
      getJobPostingDetails,
      "Get Job success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createJobPosting = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const companyId = req.user.companyId;

    const newJobPosting = await jobPostingService.createJob(
      userId,
      companyId,
      req.body
    );
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
    const updateJobPosting = await jobPostingService.updateJob(
      req.params.jobPostingId,
      req.body
    );
    const response = apiResponse.success(
      updateJobPosting,
      "Update job successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deleteJobPosting = async (req, res, next) => {
  try {
    const deleteJobPosting = await jobPostingService.deleteJobPosting(
      req.params.jobPostingId
    );
    const response = apiResponse.success(
      deleteJobPosting,
      "Job posting deleted"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
