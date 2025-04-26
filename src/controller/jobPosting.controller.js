import jobPosting from "../models/jobPosting.model.js";
import { apiResponse } from "../helper/response.helper.js";
import { RoleName } from "../models/account.model.js";
import account from "../models/account.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
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
    // const company_Id = req.user.companyId;
    const query = jobPosting
      .find({ companyId: req.params.companyId })
      .populate("accountId", "fullname");
    if (req.user.role === RoleName.GUEST) {
      query.populate("companyId", "companyName logo").populate({
        path: "listAccount.accountId",
        select: "fullname email avatarIMG",
      });
    }
    const jobPostingList = await query.exec();
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
export const addApplicants = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const job = await jobPosting.findById(req.params.jobId);
    if (!job) {
      return res.status(404).json(apiResponse.notFound("Job not found"));
    }
    let newPdfFile = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "pdfFolder",
        });
        newPdfFile = result.secure_url;
        fs.unlinkSync(req.file.path);
      } catch (err) {
        console.log(err);
      }
    }
    const inforUserPost = {
      accountId: userId,
      coverLetter: req.body.coverLetter,
      linkPdf: newPdfFile || "",
    };
    const index = job.listAccount.findIndex(
      (entry) => entry.accountId.toString() === userId
    );
    if (index !== -1) {
      Object.assign(job.listAccount[index], inforUserPost);
    } else job.listAccount.push(inforUserPost);
    await job.save();
    const response = apiResponse.created(inforUserPost, "Applicant successs");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const removeApplicants = async (req, res, next) => {};
export const getPostingDetails = async (req, res, next) => {
  try {
    const query = jobPosting.findOne({ _id: req.params.jobId });
    if (req.user.role === RoleName.GUEST) {
      query.populate("companyId", "companyName");
    }
    const findJobPosting = await query;
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
    const jobPostingDetail = await jobPosting.findOne({
      _id: req.params.jobPostingId,
    });
    if (!jobPostingDetail) {
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
    const findJob = await jobPosting.deleteOne({
      _id: req.params.jobPostingId,
    });
    if (findJob.deletedCount === 0) {
      const response = apiResponse.notFound("Job posting not found");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(findJob, "Job posting deleted");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
