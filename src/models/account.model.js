import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema;
export const RoleName = {
  ADMIN: "admin",
  STAFF: "staff",
  GUEST: "guest",
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
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
    },
    gender: {
      type: String,
    },
    avatarIMG: {
      type: String,
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
      ref: "company",
    },
    linkingProfile: {
      type: String,
    },
    listFavouritesID: {
      type: Array,
    },
    listFavouritesIDArray: {
      type: Array,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("account", account);
