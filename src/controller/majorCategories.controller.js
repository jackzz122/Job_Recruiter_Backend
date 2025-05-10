import { apiResponse } from "../helper/response.helper.js";
import majorCategoriesService from "../services/majorCategories.service.js";

export const getMajorCategories = async (req, res, next) => {
  try {
    const listMajor = await majorCategoriesService.getMajorCategories();
    const response = apiResponse.success(listMajor, "Get list major success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getNameMajors = async (req, res, next) => {
  try {
    const listMajorName = await majorCategoriesService.getNameMajors();
    const response = apiResponse.success(
      listMajorName,
      "Get list name success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getMajorLevels = async (req, res, next) => {
  try {
    const listMajorLevel = await majorCategoriesService.getMajorLevels();
    const response = apiResponse.success(
      listMajorLevel,
      "Get list major success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const createMajorCategory = async (req, res, next) => {
  try {
    const newCate = await majorCategoriesService.createMajorCategory(req.body);
    const response = apiResponse.created(
      newCate,
      "Category created successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const updateMajorCategory = async (req, res, next) => {
  try {
    const updatedCate = await majorCategoriesService.updateMajorCategory(
      req.params.majorId,
      req.body
    );
    const response = apiResponse.success(
      updatedCate,
      "Category updated successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deleteMajorCategory = async (req, res, next) => {
  try {
    await majorCategoriesService.deleteMajorCategory(req.params.majorId);
    const response = apiResponse.success("Category deleted successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
