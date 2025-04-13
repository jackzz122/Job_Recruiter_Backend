import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
export const Status = {
  PENDING: "pending",
  REVOLVED: "revolved",
  RESOLVE: "resolve",
};
export const TargetType = {
  JOB: "job",
  COMPANY: "company",
  COMMENT: "comment",
};
const reportSchema = new mongoose.Schema({
  accountId: {
    type: ObjectId,
    ref: "account",
    required: true,
  },
  target_id: {
    type: ObjectId,
    required: true,
  },
  target_type: {
    type: String,
    enum: Object.values(TargetType),
    required: true,
  },
  reason: {
    type: Array,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: "pending",
  },
  createAt: {
    type: Date,
    default: () => Date.now(),
  },
});
export default mongoose.model("report", reportSchema);
