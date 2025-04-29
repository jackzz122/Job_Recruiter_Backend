import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
const statusPost = {
  OnGoing: "ongoing",
  Stop: "stop",
  Close: "close",
};
export const statusApplications = {
  Submitted: "Submitted",
  Reviewing: "Reviewing",
  Rejected: "Rejected",
  Success: "Success",
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
    ref: "companyInfo",
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
    type: {
      summary: String,
      keySkills: {
        mainText: String,
        bulletPoints: Array,
      },
      whyYouLoveIt: {
        mainText: String,
        bulletPoints: Array,
      },
      _id: false,
    },
    _id: false,
    required: true,
  },
  listAccount: [
    {
      accountId: {
        type: ObjectId,
        ref: "account",
      },
      linkPdf: {
        type: String,
        default: "",
      },
      appliedAt: {
        type: Date,
        default: () => Date.now(),
      },
      coverLetter: {
        type: String,
        default: "",
      },
      status: {
        type: String,
        enum: Object.values(statusApplications),
        default: "Submitted",
      },
      notes: {
        type: String,
        default: "",
      },
    },
  ],
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
