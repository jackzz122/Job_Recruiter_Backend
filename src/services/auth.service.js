import account from "../models/account.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { RoleName } from "../models/account.model.js";
import pendingApprove from "../models/pendingApprove.js";

const maxAge = 3 * 24 * 60 * 60;

class authService {
  createToken(user) {
    return jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: maxAge });
  }

  async comparePassword(password, hasPash) {
    return await bcrypt.compare(password, hasPash);
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
}

export default new authService();
