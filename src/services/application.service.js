import jobPosting from "../models/jobPosting.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";

class applicationService {
  async submitApplication(candidateId, jobId, file, coverLetter) {
    const job = await jobPosting.findById(jobId);
    if (!job) {
      const err = new Error("Job not found");
      err.status = 404;
      throw err;
    }

    let newPdfFile = "";
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "pdfFolder",
        });
        newPdfFile = result.secure_url;
        fs.unlinkSync(file.path);
      } catch (err) {
        console.log(err);
      }
    }

    const inforUserPost = {
      accountId: candidateId,
      coverLetter: coverLetter,
      linkPdf: newPdfFile || "",
    };

    const index = job.listAccount.findIndex(
      (entry) => entry.accountId.toString() === candidateId
    );

    if (index !== -1) {
      Object.assign(job.listAccount[index], inforUserPost);
    } else {
      job.listAccount.push(inforUserPost);
    }

    await job.save();
    return inforUserPost;
  }
  async getCandidateByJob() {
    const jobPostings = await jobPosting
      .find({})
      .populate("listAccount.accountId", "fullname email phone avatarIMG");
    if (!jobPostings) {
      const err = new Error("No job posting found");
      err.status = 404;
      throw err;
    }
    return jobPostings.map((job) => {
      return {
        jobId: job._id,
        jobTitle: job.title,
        listAccount: job.listAccount.map((account) => {
          return {
            accountId: account.accountId._id,
            fullname: account.accountId.fullname,
            email: account.accountId.email,
            phone: account.accountId.phone,
            avatarIMG: account.accountId.avatarIMG,
            linkPdf: account.linkPdf,
            coverLetter: account.coverLetter,
            notes: account.notes,
            status: account.status,
            appliedAt: account.appliedAt,
          };
        }),
      };
    });
  }
  async getCompaniesAppliedByCandidate(accountId) {
    console.log("accountId", accountId);
    const companies = await jobPosting
      .find({
        "listAccount.accountId": accountId,
      })
      .populate("companyId", "companyName logo");
    if (!companies) {
      const err = new Error("No companies found");
      err.status = 404;
      throw err;
    }
    return companies;
  }
  async approveCandidate() {}
  async rejectCandidate() {}
}
export default new applicationService();
