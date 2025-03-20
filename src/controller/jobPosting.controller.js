import jobPosting from "../models/jobPosting.model";

export const getAllJobPostings = async (req, res, next) => {
  try {
    const jobPostingList = await jobPosting.find();
    if (!jobPostingList)
      return res
        .status(404)
        .json({ message: "JobPosting not found in any company" });
    return res.json({ list: jobPostingList });
  } catch (err) {
    next(err);
  }
};

export const getJobPostingList = async (req, res, next) => {
  try {
    const company_Id = req.companyId;
    const jobPostingList = await jobPosting.find({ companyId: company_Id });
    if (jobPostingList.length === 0)
      return res.status(404).json({ message: "No job posting found" });
    return res.json(jobPostingList);
  } catch (err) {
    next(err);
  }
};

export const getPostingDetails = async (req, res, next) => {
  try {
    const jobId = req.params.jobId;
    const findJobPosting = await jobPosting.find({ _id: jobId });
    if (findJobPosting.length === 0)
      return res.status(404).json({ message: "Job Posting not found" });
    return res.status(200).json(findJobPosting);
  } catch (err) {
    next(err);
  }
};

export const createJobPosting = async (req, res, next) => {
  try {
    const user_Id = req.userId;
    const company_Id = req.companyId;
    const newJobPosting = new jobPosting({
      ...req.body,
      account_staff_id: user_Id,
      companyId: company_Id
    })
    await newJobPosting.save();
    return res.status(201).json({message: "Create job posting successfully"})
  } catch (err) {
    next(err);
  }
};

export const updateJobPosting = async (req, res, next) => {
  try{
    const jobPostingId = req.params.jobPostingId;
    const jobPostingDetail = jobPosting.find({_id: jobPostingId});
    if(jobPostingDetail.length === 0) return res.status(404).json({message: "Job posting not founded"});
    Object.assign(jobPostingDetail, req.body);
    await jobPostingDetail.save();
    return res.json({message: "Updated job successfully"});
  }catch(err) {
    next(err);
  }
};

export const deleteJobPosting = async (req, res, next) => {
  try {
    const id = req.params.jobPostingId;
    const findJob = await jobPosting.deleteOne({ _id: id });
    if(findJob.deletedCount === 0) return res.status(404).json({message: "Job posting not foundede"});
    return res.json({message: "Job posting deleted"})
  } catch (err) {
    next(err);
  }
};
