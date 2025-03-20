import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
export const Status = {
    PENDING: "pending",
    REVOLVED: "revolved",
    RESOLVE: "resolve"
};
export const TargetType = {
  JOB: "job",
  COMPANY: "company",
  COMMENT: "comment"
}
const reportSchema = new mongoose.Schema({
  account_id: {
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
    enum: ObjectId.values(TargetType),
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(Status),
    required: true
  },
  createAt: {
    type: Date,
    default: () => Date.now()
  }

});
export default mongoose.model("report", reportSchema);
