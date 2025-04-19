import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const commentSchema = new mongoose.Schema({
  account_id: {
    type: ObjectId,
    ref: "account",
  },
  company_id: {
    type: ObjectId,
    ref: "companyInfo",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  details: {
    type: {
      whyLove: String,
      suggest: String,
    },
    _id: false,
    required: true,
  },
  createdDate: {
    type: Date,
    default: () => Date.now(),
  },
});
export default mongoose.model("comment", commentSchema);
