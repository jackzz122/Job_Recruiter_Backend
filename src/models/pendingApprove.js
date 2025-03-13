import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;

const pendingApproveSchema = new mongoose.Schema({
  accountID: {
    type: ObjectId,
    ref: "account",
  },
  nameCompoany: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  years: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  sizing: {
    type: Number,
    required: true,
  },
});

export default mongoose.model("pending_approve", pendingApproveSchema);
