import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
export const RoleName = {
  ADMIN: "admin",
  Recruit: "recruit",
  STAFF_RECRUIT: "staffRecruit",
  GUEST: "guest",
};
export const Gender = {
  MALE: "male",
  FEMALE: "female",
  OTHER: "other",
};

const account = new mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(RoleName),
      maxLength: 32,
      required: true,
    },
    categoryId: {
      type: ObjectId,
      ref: "category",
    },
    fullname: {
      type: String,
      maxLength: 32,
      required: true,
    },
    avatarImg: {
      type: String,
    },
    dob: {
      type: Date,
    },
    address: {
      type: String,
      maxLength: 255,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
    },
    avatarIMG: {
      type: String,
      default: "",
    },
    majorId: {
      type: ObjectId,
      ref: "major",
    },
    education: {
      type: Array,
    },
    skills: {
      type: Array,
    },
    certificate: {
      type: Array,
    },
    companyId: {
      type: ObjectId,
      ref: "companyInfo",
    },
    linkingProfile: {
      type: String,
      default: "",
    },
    listFavouritesCompanyID: {
      type: Array,
    },
    listFavouritesJobsID: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("account", account);
