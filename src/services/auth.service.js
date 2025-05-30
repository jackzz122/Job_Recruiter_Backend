import account, { statusAccount } from "../models/account.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RoleName } from "../models/account.model.js";
import pendingApprove from "../models/pendingApprove.js";
import nodemailer from "nodemailer";
import company from "../models/companyInfor.model.js";
import dotenv from "dotenv";
dotenv.config();
const maxAge = 3 * 24 * 60 * 60;

class authService {
  createToken(user) {
    return jwt.sign(
      { _id: user._id, role: user.role, companyId: user.companyId },
      process.env.JWT_SECRET,
      { expiresIn: maxAge }
    );
  }

  async comparePassword(password, hasPash) {
    return await bcrypt.compare(password, hasPash);
  }

  async forgotPassword(email) {
    const findUser = await account.findOne({ email });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const transpoter = await nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Password",
      text: `Your code is ${code}`,
    };
    await account.updateOne(
      { _id: findUser._id },
      {
        $set: {
          forgotPassCode: code,
          forgotPassCodeExpire: new Date(Date.now() + 2 * 60 * 1000),
        },
      }
    );
    await transpoter.sendMail(mailOptions);

    return {
      id: findUser._id,
      message: "Reset password email sent",
    };
  }

  async createUser(data) {
    const { email, password } = data;
    const existAccount = await account.findOne({ email });

    if (existAccount) {
      const error = new Error("Account exists");
      error.status = 400;
      throw error;
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    data.password = hash;

    const userAccount = new account({
      ...data,
      role: "guest",
    });

    await userAccount.save();
    return userAccount;
  }

  async loginUser(email, password, roleGroup) {
    const findUser = await account.findOne({ email });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await this.comparePassword(password, findUser.password);
    if (!isMatch) {
      const error = new Error("Email or password was incorrect");
      error.status = 404;
      throw error;
    }

    if (!Array.isArray(roleGroup) || !roleGroup.includes(findUser.role)) {
      const error = new Error("You are not authorized to access this");
      error.status = 403;
      throw error;
    }
    if (findUser.statusAccount === statusAccount.BLOCKED) {
      const error = new Error(
        "Your account has been blocked, please contact to our admin to unblock"
      );
      error.status = 403;
      throw error;
    }
    return findUser;
  }

  async registerRecruiter(data) {
    const findAccount = await account.findOne({ email: data.email });
    if (!findAccount) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    if (findAccount.role === RoleName.Recruit) {
      const error = new Error("You are already a Recruiter");
      error.status = 403;
      throw error;
    }

    if (findAccount.role === RoleName.STAFF_RECRUIT) {
      const error = new Error(
        "You are not authorized to register this, please contact to our page"
      );
      error.status = 403;
      throw error;
    }

    if (findAccount.role === RoleName.ADMIN) {
      const error = new Error("You are already an Admin");
      error.status = 403;
      throw error;
    }
    if (findAccount.statusAccount === statusAccount.BLOCKED) {
      const error = new Error(
        "Your account has been blocked, please contact to our admin to unblock"
      );
      error.status = 403;
      throw error;
    }
    const pendingItem = await pendingApprove.findOne({
      accountID: findAccount._id,
    });

    if (pendingItem) {
      const error = new Error("You have already sent a request");
      error.status = 403;
      throw error;
    }

    const newPendingItem = new pendingApprove({
      ...data,
      accountID: findAccount._id,
    });
    await newPendingItem.save();
    return newPendingItem;
  }

  async changePassword(userId, oldPassword, newPassword) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await this.comparePassword(oldPassword, findUser.password);
    if (!isMatch) {
      const error = new Error("Your old password is wrong");
      error.status = 400;
      throw error;
    }

    const saltRounds = 10;
    const hashPass = await bcrypt.hash(newPassword, saltRounds);
    findUser.password = hashPass;
    await findUser.save();

    const { password, ...currentUser } = findUser.toObject();
    return currentUser;
  }
  async verifyCode(userId, verifyCode) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    const userCode = verifyCode;
    const realCode = findUser.forgotPassCode;
    const expired = findUser.forgotPassCodeExpire;

    if (!realCode || !expired) {
      const error = new Error("No verification code found");
      error.status = 400;
      throw error;
    }

    if (realCode !== userCode) {
      const error = new Error("Invalid verification code");
      error.status = 400;
      throw error;
    }

    if (new Date() > expired) {
      const error = new Error("Verification code has expired");
      error.status = 400;
      throw error;
    }

    await account.updateOne(
      { _id: findUser._id },
      { $unset: { forgotPassCode: "", forgotPassCodeExpire: "" } }
    );

    return {
      message: "Code verified successfully",
      userId: findUser._id,
    };
  }
  async resetPassword(userId, newPassword) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(newPassword, saltRounds);
    findUser.password = hashPass;
    await findUser.save();
    const { password, ...currentUser } = findUser.toObject();
    return currentUser;
  }
}

export default new authService();
