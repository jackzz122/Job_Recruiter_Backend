import { apiResponse } from "../helper/response.helper.js";
import majorCategories from "../models/majorCatergories.model.js";

export const getMajorCategories = async (req, res, next) => {
  try {
    const listMajor = await majorCategories.find();
    if (listMajor.length === 0) {
      const response = apiResponse.notFoundList("Major list not found");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(listMajor, "Get list major success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const getNameMajors = async (req, res, next) => {
  try {
    const listMajorName = await majorCategories.distinct("name");
    if (listMajorName.length === 0) {
      const response = apiResponse.notFoundList("No major name catogry");
      return res.status(response.status).json(response.body);
    }
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
    const listMajorLevel = await majorCategories.distinct("level");
    if (listMajorLevel.length === 0) {
      const response = apiResponse.notFoundList("No major level catogry");
      return res.status(response.status).json(response.body);
    }
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
    const newCate = await majorCategories({
      ...req.body,
    });
    await newCate.save();
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
    const findCate = await majorCategories.findOne({ _id: req.params.majorId });
    if (!findCate) {
      const response = apiResponse.notFound("Category not found");
      return res.status(response.status).json(response.body);
    }
  } catch (err) {
    next(err);
  }
};
export const deleteMajorCategory = async (req, res, next) => {
  try {
    const findMajor = await majorCategories.deleteOne({
      _id: req.params.majorId,
    });
    if (findMajor.deletedCount === 0) {
      const response = apiResponse.notFound("Major not found");
      p;
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success("Category deleted successfully");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
