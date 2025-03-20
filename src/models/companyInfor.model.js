import mongoose from "mongoose";

const companyInfoSchema = new mongoose.Schema({
  nameCompany: {
    type: String,
    required: true,
  },
  logo: {
    type: String,
    required: true,
  },
  years: {
    type: Number,
    required: true,
  },
  description: {
    type: Array,
    required: true,
  },
  sizing: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => Date.now(),
  }
});

export default mongoose.model("companyInfo", companyInfoSchema);
