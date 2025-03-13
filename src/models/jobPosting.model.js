import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const jobPostingSchema = new mongoose.Schema({
  account_HR_ID: {
    type: ObjectId,
    ref: "account",
  },
  title: {
    type: String,
    required: true,
  },
  sizingPeople: {
    type: Number,
    required: true,
    min: 1,
    max: 100,
  },
  companyId: {
    type: ObjectId,
    ref: "company",
  },
  majorId: {
    type: ObjectId,
    required: true,
    ref: "majorCategory",
  },
  salaryRange: {
    type: Number,
    required: true,
  },
  description: {
    type: Array,
    required: true,
  },
  listAccountId: {
    type: Array,
  },
});
export default mongoose.model("jobPosting", jobPostingSchema);
