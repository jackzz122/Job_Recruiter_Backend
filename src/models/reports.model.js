import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
export const Status = {
  PENDING: "pending",
  RESOLVED: "resolved",
  REJECTED: "rejected",
};
export const TargetType = {
  JOB: "jobPosting",
  COMPANY: "companyInfo",
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
    ref: "account",
    required: true,
  },
  reportTarget: {
    type: ObjectId,
    refPath: "target_type",
    required: true,
  },
  target_type: {
    type: String,
    enum: Object.values(TargetType),
    required: true,
  },
  reason: {
    type: {
      reasonTitle: String,
      additionalReason: String,
    },
    _id: false,
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(Status),
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});
export default mongoose.model("report", reportSchema);
