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
export const statusAccount = {
  PENDING: "pending",
  APPROVE: "approve",
  BLOCKED: "blocked",
  REJECTED: "rejected",
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
    title: {
      type: String,
      default: "",
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
    dob: {
      type: String,
      default: "",
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
    aboutMe: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      default: Gender.MALE,
    },
    avatarIMG: {
      type: String,
      default: "",
    },
    uploadCV: {
      linkPdf: {
        type: String,
        default: "",
      },
      nameFile: {
        type: String,
        default: "",
      },
      uploadedAt: {
        type: Date,
        default: () => Date.now(),
      },
    },
    statusAccount: {
      type: String,
      enum: Object.values(statusAccount),
      default: function () {
        return this.role === RoleName.Recruit
          ? statusAccount.PENDING
          : statusAccount.APPROVE;
      },
    },
    forgotPassCode: {
      type: String,
      default: "",
    },
    forgotPassCodeExpire: {
      type: Date,
    },
    projects: [
      {
        projectName: {
          type: String,
          default: "",
        },
        link: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        role: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    education: [
      {
        major: {
          type: String,
          default: "",
        },
        school: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    skills: [
      {
        value: {
          type: String,
          default: "",
        },
      },
    ],
    certificate: [
      {
        name: {
          type: String,
          default: "",
        },
        organization: {
          type: String,
          default: "",
        },
        month: {
          type: Number,
          default: "",
        },
        year: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    workEx: [
      {
        jobTitle: {
          type: String,
          default: "",
        },
        company: {
          type: String,
          default: "",
        },
        responsibilites: {
          type: String,
          default: "",
        },
        startDate: {
          type: String,
          default: "",
        },
        endDate: {
          type: String,
          default: "",
        },
        description: {
          type: String,
          default: "",
        },
      },
    ],
    companyId: {
      type: ObjectId,
      ref: "companyInfo",
    },
    linkingProfile: {
      type: String,
      default: "",
    },
    listFavouritesCompanyID: [
      {
        type: ObjectId,
        ref: "companyInfo",
      },
    ],
    listFavouritesJobsID: [
      {
        type: ObjectId,
        ref: "jobPosting",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("account", account);
