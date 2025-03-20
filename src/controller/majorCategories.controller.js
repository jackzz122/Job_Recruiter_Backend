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

export const createMajorCategory = async (req, res, next) => {
  try {
    const newCate = await majorCategories({
      ...req.body,
    });
    await newCate.save();
    return res.status(201).json({ message: "Category created successfully" });
  } catch (err) {
    next(err);
  }
};
export const updateMajorCategory = async (req, res, next) => {
  try {
    const id = req.params.majorId;
    const findCate = majorCategories.findById(id);
    if (!findCate.length) {
      return res.status(404).json({ message: "Category not found" });
    }
  } catch (err) {
    next(err);
  }
};
export const deleteMajorCategory = async (req, res, next) => {
  try {
    const id = req.params.majorId;
    await majorCategories.deleteById(id);
    return res.status(204).json({ message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};
