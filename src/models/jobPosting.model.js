import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const statusPost = {
  OnGoing: "ongoing",
  Stop: "stop",
  Close: "close",
};
const jobPostingSchema = new mongoose.Schema({
  accountId: {
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
    type: Array,
  },
  minRange: {
    type: Number,
    required: true,
    min: 1,
  },
  maxRange: {
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
  status: {
    type: String,
    enum: Object.values(statusPost),
    default: "ongoing",
  },
  startDate: {
    type: Date,
    required: true,
  },
  experience: {
    type: Number,
    required: true,
  },
  applicationDeadline: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});
export default mongoose.model("jobPosting", jobPostingSchema);
