import jobPosting from "../models/jobPosting.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs";
import { statusApplications } from "../models/jobPosting.model.js";
import { sendMailService } from "../services/EmailService.js";

class applicationService {
  async submitApplication(candidateId, jobId, file, coverLetter, cvLink) {
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
        await fs.unlink(file.path);
      } catch (err) {
        console.log(err);
      }
    }
    console.log(cvLink);
    const inforUserPost = {
      accountId: candidateId,
      coverLetter: coverLetter,
      linkPdf: newPdfFile || cvLink || "",
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
  async getCandidateByJob(companyId) {
    if (!companyId) {
      const err = new Error("Company ID is required");
      err.status = 400;
      throw err;
    }

    const jobPostings = await jobPosting
      .find({ companyId: companyId })
      .populate("listAccount.accountId", "fullname email phone avatarIMG");

    if (!jobPostings || jobPostings.length === 0) {
      return [];
    }

    return jobPostings
      .map((job) => {
        if (!job) return null;

        return {
          jobId: job._id || "",
          jobTitle: job.title || "",
          listAccount: (job.listAccount || [])
            .map((account) => {
              if (!account || !account.accountId) return null;

              return {
                accountId: account.accountId._id || "",
                fullname: account.accountId.fullname || "",
                email: account.accountId.email || "",
                phone: account.accountId.phone || "",
                avatarIMG: account.accountId.avatarIMG || "",
                linkPdf: account.linkPdf || "",
                coverLetter: account.coverLetter || "",
                notes: account.notes || "",
                status: account.status || "",
                appliedAt: account.appliedAt || new Date(),
              };
            })
            .filter((account) => account !== null),
        };
      })
      .filter((job) => job !== null);
  }
  async getCompaniesAppliedByCandidate(accountId) {
    const companies = await jobPosting
      .find({
        "listAccount.accountId": accountId,
      })
      .populate("companyId", "companyName logo status");
    if (!companies) {
      const err = new Error("No companies found");
      err.status = 404;
      throw err;
    }
    return companies;
  }
  async changeStatus(jobId, userId, status, ownerMail, receiveMail) {
    if (!jobId || !userId) {
      const err = new Error("Job ID and User ID are required");
      err.status = 400;
      throw err;
    }

    const job = await jobPosting.findById(jobId);
    if (!job) {
      const err = new Error("Job not found");
      err.status = 404;
      throw err;
    }

    const candidate = job.listAccount.find(
      (account) => account.accountId.toString() === userId
    );
    if (!candidate) {
      const err = new Error("Candidate not found in this job");
      err.status = 404;
      throw err;
    }

    if (
      status === statusApplications.Reviewing &&
      (candidate.status === statusApplications.Success ||
        candidate.status === statusApplications.Rejected)
    ) {
      return candidate;
    }

    candidate.status = status;
    await job.save();

    switch (status) {
      case statusApplications.Success:
        await sendMailService(
          ownerMail,
          "Congratulation",
          "From web tuyen dung, you have been accepted",
          receiveMail,
          "Congratulation! You have been accepted"
        );
        break;

      case statusApplications.Rejected:
        await sendMailService(
          ownerMail,
          "You are being Rejected",
          "Thanks for spent time for our job",
          receiveMail,
          "So sorry, you are not accepted"
        );
        break;
    }

    return candidate;
  }
}
export default new applicationService();
