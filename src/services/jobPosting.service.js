import jobPostingModel from "../models/jobPosting.model.js";
class jobPostingService {
  async getAllJobPosting() {
    const jobPosting = await jobPostingModel
      .find()
      .populate("companyId", "companyName logo status");
    if (!jobPosting) {
      const error = new Error("No job posting found");
      error.statusCode = 404;
      throw error;
    }
    return jobPosting;
  }
  async createJob(ownerId, companyId, data) {
    const newJobPosting = await jobPostingModel({
      ...data,
      accountId: ownerId,
      companyId: companyId,
    });
    await newJobPosting.save();
    return newJobPosting;
  }
  async changeStatus(jobId, status) {
    const jobPosting = await jobPostingModel.findById(jobId);
    if (!jobPosting) {
      const error = new Error("Job posting not found");
      error.statusCode = 404;
      throw error;
    }
    jobPosting.status = status;
    await jobPosting.save();
    return jobPosting;
  }
  async getJobPostingList(companyId) {
    const jobPosting = await jobPostingModel
      .find({ companyId: companyId })
      .populate({
        path: "accountId",
        select: "fullname",
      })
      .populate({
        path: "companyId",
        select: "companyName logo",
      });
    console.log(jobPosting);
    if (!jobPosting) {
      const error = new Error("No job posting list found");
      error.statusCode = 404;
      throw error;
    }
    return jobPosting;
  }
  async getJobPostingById(jobId) {
    const jobPosting = await jobPostingModel
      .findOne({ _id: jobId })
      .populate("companyId");
    if (!jobPosting) {
      const error = new Error("No job posting found");
      error.statusCode = 404;
      throw error;
    }
    return jobPosting;
  }
  async updateJob(jobId, jobData) {
    const existingJob = await jobPostingModel.findById(jobId);
    if (!existingJob) {
      const error = new Error("Job posting not found");
      error.statusCode = 404;
      throw error;
    }
    Object.assign(existingJob, jobData);
    await existingJob.save();
    return existingJob;
  }
  async deleteJobPosting(jobId) {
    const deletedJob = await jobPostingModel.findByIdAndDelete(jobId);
    if (!deletedJob) {
      const error = new Error("Job posting not found");
      error.statusCode = 404;
      throw error;
    }
    return deletedJob;
  }
}

export default new jobPostingService();
