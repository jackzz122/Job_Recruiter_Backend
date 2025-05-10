import applicationService from "./application.service.js";
import account from "../models/account.model.js";
import jobPosting from "../models/jobPosting.model.js";
import company from "../models/companyInfor.model.js";
import cloudinary from "../utils/cloudinary.js";
import fs from "fs/promises";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY });

class candidateService {
  async uploadCV() {}
  async getProfileCandidate(candidateId) {
    const profileCandidate = await account.findById(candidateId);
    if (!profileCandidate) {
      const err = new Error("Candidate not found");
      err.status = 404;
      throw err;
    }
    return profileCandidate;
  }
  async saveJobs(userId, jobId) {
    const findJobPosting = await jobPosting.findById(jobId);
    if (!findJobPosting) {
      const error = new Error("Job posting not found");
      error.status = 404;
      throw error;
    }

    const findUser = await account.findById(userId);
    if (!findUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (!findUser.listFavouritesJobsID.includes(jobId)) {
      findUser.listFavouritesJobsID.push(jobId);
      await findUser.save();
    }

    return findUser.listFavouritesJobsID;
  }
  async saveCompanies(userId, companyId) {
    const findCompany = await company.findOne({ _id: companyId });
    if (!findCompany) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }

    const findUser = await account.findById(userId);
    if (!findUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    if (!findUser.listFavouritesCompanyID.includes(companyId)) {
      findUser.listFavouritesCompanyID.push(companyId);
      await findUser.save();
    }

    return findUser.listFavouritesCompanyID;
  }
  async unSaveJob(userId, jobId) {
    const findJobPosting = await jobPosting.findById(jobId);
    if (!findJobPosting) {
      const error = new Error("Job posting not found");
      error.status = 404;
      throw error;
    }

    const findUser = await account.findById(userId);
    if (!findUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    findUser.listFavouritesJobsID = findUser.listFavouritesJobsID.filter(
      (id) => id.toString() !== jobId
    );
    await findUser.save();
    return findUser.listFavouritesJobsID;
  }
  async unSaveCompany(userId, companyId) {
    const findCompany = await company.findById(companyId);
    if (!findCompany) {
      const error = new Error("Company not found");
      error.status = 404;
      throw error;
    }

    const findUser = await account.findById(userId);
    if (!findUser) {
      const error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    findUser.listFavouritesCompanyID = findUser.listFavouritesCompanyID.filter(
      (id) => id.toString() !== companyId
    );
    await findUser.save();
    return findUser.listFavouritesCompanyID;
  }
  async getAppliedJobs(candidateId) {
    const appliedList = await applicationService.getCompaniesAppliedByCandidate(
      candidateId
    );
    console.log("appliedList", appliedList);
    return appliedList;
  }
  async deleteAccount(candidateId) {}

  async getProfile(userId, role) {
    let query = account.findOne({ _id: userId });

    if (role === "guest") {
      query = query
        .populate({
          path: "listFavouritesCompanyID",
          select: "companyName country address logo",
        })
        .populate({
          path: "listFavouritesJobsID",
          select:
            "title minRange maxRange location startDate applicationDeadline",
          populate: {
            path: "companyId",
            select: "companyName",
          },
        });
    }

    const findUser = await query.lean();
    if (!findUser) {
      const error = new Error("User not found in database");
      error.status = 404;
      throw error;
    }

    const { password, ...currentUser } = findUser;
    return currentUser;
  }

  async updateProfile(userId, data, file) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    let avatarUploadError = null;
    if (file) {
      try {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "avatar",
        });
        findUser.avatarIMG = result.secure_url;
        await fs.unlink(file.path);
      } catch (err) {
        console.log(err);
        avatarUploadError = "Có lỗi khi tải ảnh lên. Vui lòng thử lại!";
      }
    }

    if (data) {
      const arrayFields = [
        "education",
        "certificate",
        "projects",
        "workEx",
        "skills",
      ];
      Object.entries(data).forEach(([key, value]) => {
        if (arrayFields.includes(key)) {
          if (value._id) {
            const index = findUser[key].findIndex(
              (item) => item._id.toString() === value._id
            );

            if (index !== -1) {
              const hasOnlyId = Object.keys(value).length === 1;
              if (hasOnlyId) {
                findUser[key].splice(index, 1);
              } else {
                const { _id, ...bodyValue } = value;
                findUser[key][index] = { ...findUser[key][index], ...value };
              }
            }
          } else findUser[key].push(value);
        } else {
          findUser[key] = value;
        }
      });
    }

    await findUser.save();
    return { user: findUser, avatarUploadError };
  }

  async generateImproveText(field, content) {
    if (!field || !content) {
      const error = new Error("Field và content là bắt buộc");
      error.status = 400;
      throw error;
    }

    const prompt = `Hãy viết lại phần "${field}" sau đây để súc tích, chuyên nghiệp và dễ đọc hơn. Giữ nguyên ý chính, ngắn gọn hơn: "${content}"`;
    const maxRetries = 4;
    let attempt = 0;
    let responseText = null;

    while (attempt < maxRetries) {
      try {
        const result = await ai.models.generateContent({
          model: "gemini-2.0-flash-lite",
          contents: prompt,
        });

        responseText = result.text;
        break;
      } catch (error) {
        attempt++;
        console.log(
          `Lần thử ${attempt}/${maxRetries} thất bại: ${error.message}`
        );

        if (attempt >= maxRetries || !error.message.includes("overloaded")) {
          throw error;
        }

        const waitTime = 1000 * attempt;
        console.log(`Chờ ${waitTime}ms trước khi thử lại...`);
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    return {
      original: content,
      improved: responseText,
      field: field,
    };
  }

  async deleteAccount(userId) {
    const deleteUser = await account.findOneAndDelete({ _id: userId });
    if (!deleteUser) {
      const error = new Error("Delete your account error");
      error.status = 404;
      throw error;
    }
    return deleteUser;
  }
}

export default new candidateService();
