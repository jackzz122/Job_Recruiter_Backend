import mongoose from "mongoose";

const majorCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
  },
});
majorCategoriesSchema.index({ name: 1, level: 1 }, { unique: true });
export default mongoose.model("majorCategory", majorCategoriesSchema);
