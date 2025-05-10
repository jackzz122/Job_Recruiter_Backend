import majorCategories from "../models/majorCatergories.model.js";

class majorCategoriesService {
  async getMajorCategories() {
    const listMajor = await majorCategories.find();
    if (listMajor.length === 0) {
      const error = new Error("Major list not found");
      error.status = 404;
      throw error;
    }
    return listMajor;
  }

  async getNameMajors() {
    const listMajorName = await majorCategories.distinct("name");
    if (listMajorName.length === 0) {
      const error = new Error("No major name category");
      error.status = 404;
      throw error;
    }
    return listMajorName;
  }

  async getMajorLevels() {
    const listMajorLevel = await majorCategories.distinct("level");
    if (listMajorLevel.length === 0) {
      const error = new Error("No major level category");
      error.status = 404;
      throw error;
    }
    return listMajorLevel;
  }

  async createMajorCategory(data) {
    const newCate = new majorCategories({
      ...data,
    });
    await newCate.save();
    return newCate;
  }

  async updateMajorCategory(majorId, data) {
    const findCate = await majorCategories.findOne({ _id: majorId });
    if (!findCate) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }
    Object.assign(findCate, data);
    await findCate.save();
    return findCate;
  }

  async deleteMajorCategory(majorId) {
    const findMajor = await majorCategories.deleteOne({
      _id: majorId,
    });
    if (findMajor.deletedCount === 0) {
      const error = new Error("Major not found");
      error.status = 404;
      throw error;
    }
    return true;
  }
}

export default new majorCategoriesService();
