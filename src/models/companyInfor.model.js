import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const companyInfoSchema = new mongoose.Schema({
  accountID: {
    type: ObjectId,
    ref: "account",
  },
  companyName: {
    type: String,
    required: true,
  },
  websiteUrl: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  emailCompany: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  phoneNumberCompany: {
    type: String,
  },
  logo: {
    type: String,
  },
  years: {
    type: Number,
  },
  description: {
    type: Array,
  },
  sizing: {
    type: Number,
  },

  createdAt: {
    type: Date,
    default: () => Date.now(),
  },
});

export default mongoose.model("companyInfo", companyInfoSchema);
