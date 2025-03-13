import mongoose from "mongoose";

const majorCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: String,
  },
});
export default mongoose.model("majorCategory", majorCategoriesSchema);
