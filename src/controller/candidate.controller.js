import { apiResponse } from "../helper/response.helper.js";
import candidateService from "../services/candidate.service.js";

export const companyFavourite = async (req, res, next) => {
  try {
    const favourites = await candidateService.saveCompanies(
      req.user._id,
      req.params.companyId
    );
    const response = apiResponse.success(
      favourites,
      "Add favourite company success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getAppliedJobList = async (req, res, next) => {
  try {
    const findAccountApplied = await candidateService.getAppliedJobs(
      req.params.userId
    );
    const response = apiResponse.success(
      findAccountApplied,
      "Get job applied success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const removeFavouriteCompany = async (req, res, next) => {
  try {
    const favourites = await candidateService.unSaveCompany(
      req.user._id,
      req.params.companyId
    );
    const response = apiResponse.success(
      favourites,
      "Remove favourite company success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const jobFavourite = async (req, res, next) => {
  try {
    const favourites = await candidateService.saveJobs(
      req.user._id,
      req.params.jobPostingId
    );
    const response = apiResponse.success(
      favourites,
      "Add job to favourites success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const removeFavouriteJob = async (req, res, next) => {
  try {
    const favourites = await candidateService.unSaveJob(
      req.user._id,
      req.params.jobPostingId
    );
    const response = apiResponse.success(
      favourites,
      "Removed job from favourites"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
