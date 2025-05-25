import mongoose from "mongoose";

const majorCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
export default mongoose.model("majorCategory", majorCategoriesSchema);
