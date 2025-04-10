import majorCategories from "../models/majorCatergories.model.js";

export const getMajorCategories = async (req, res, next) => {
  try {
    const listMajor = await majorCategories.find();
    if (listMajor.length === 0)
      return res.status(404).json({ messaeg: "No major category" });
    return res.json(listMajor);
  } catch (err) {
    next(err);
  }
};

export const getNameMajors = async (req, res, next) => {
  try {
    const listMajorName = await majorCategories.distinct("name");
    if (listMajorName.length === 0) {
      return res.status(404).json({ message: "No major name category" });
    }
    return res.json(listMajorName);
  } catch (err) {
    next(err);
  }
};

export const getMajorLevels = async (req, res, next) => {
  try {
    const listMajorLevel = await majorCategories.distinct("level");
    if (listMajorLevel.length === 0) {
      return res.status(404).json({ message: "No major level category" });
    }
    return res.json(listMajorLevel);
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
    return res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
export const updateMajorCategory = async (req, res, next) => {
  try {
    const findCate = majorCategories.findOne({ _id: req.params.majorId });
    if (!findCate) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
};
export const deleteMajorCategory = async (req, res, next) => {
  try {
    const findMajor = majorCategories.findOne({ _id: req.params.majorId });
    if (!findMajor) return res.status(404).json({ message: "Major not found" });
    await majorCategories.deleteOne({ _id: req.params.majorId });
    return res.status(204).json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
