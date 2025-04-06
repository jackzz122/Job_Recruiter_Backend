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
  country: {
    type: String,
    default: "",
  },
  overTime: {
    type: Boolean,
    default: false,
  },
  keySkills: {
    type: Array,
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
    default: "",
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
    default: "",
  },
  logo: {
    type: String,
    default: "",
  },
  years: {
    type: Number,
    default: 0,
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
