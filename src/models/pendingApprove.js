import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const pendingApproveSchema = new mongoose.Schema({
  accountID: {
    type: ObjectId,
    ref: "account",
  },
  companyName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

export default mongoose.model("pending_approve", pendingApproveSchema);
