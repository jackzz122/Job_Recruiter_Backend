import pendingApprove from "../models/pendingApprove.js";
import account from "../models/account.model.js";
import { RoleName, statusAccount } from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import { status } from "../models/pendingApprove.js";
import mongoose from "mongoose";
import { sendMailService } from "./EmailService.js";

class pendingApproveService {
  async getPendingList() {
    const pendingList = await pendingApprove
      .find()
      .populate({ path: "accountID", select: "fullname email avatarIMG" });

    if (pendingList.length === 0) {
      const error = new Error("Not found any pending list");
      error.status = 404;
      throw error;
    }

    return pendingList;
  }

  async confirmPendingItem(userId, companyData) {
    try {
      // Step 1: Find and validate user
      const findUser = await account.findOne({ _id: userId });
      if (!findUser) {
        const error = new Error("Account not found");
        error.status = 404;
        throw error;
      }

      // Step 2: Find and validate pending item
      const pendingItem = await pendingApprove.findOne({
        accountID: userId,
      });
      if (!pendingItem) {
        const error = new Error("Pending item not found");
        error.status = 404;
        throw error;
      }

      // Step 3: Create company first with status approve
      const newCompany = new company({
        ...companyData,
      });
      await newCompany.save();

      try {
        // Step 4: Update user information
        findUser.role = RoleName.Recruit;
        findUser.companyId = newCompany._id;
        await findUser.save();

        // Step 5: Send email notification
        await sendMailService(
          "webtuyendung567@gmail.com",
          "Recruiter Account Account",
          "Congratulation! Your recruiter account has been granted",
          findUser.email,
          `You can use your account that you created to enter recruiter page`
        );

        // Step 6: Delete pending item after everything is successful
        await pendingApprove.deleteOne({ _id: pendingItem._id });

        return { message: "Company approved successfully" };
      } catch (error) {
        // If any step fails after company creation, delete the company
        await company.deleteOne({ _id: newCompany._id });
        throw error;
      }
    } catch (error) {
      throw error;
    }
  }

  async changeStatusPendingItem(pendingItemId, status) {
    const findPendingItem = await pendingApprove.findOne({
      _id: pendingItemId,
    });

    if (!findPendingItem) {
      const error = new Error("Pending item not found");
      error.status = 404;
      throw error;
    }

    const findUser = await account.findOne({ _id: findPendingItem.accountID });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    findPendingItem.prevStatus = findPendingItem.status;
    findPendingItem.status = status;
    findUser.statusAccount = status;

    await findPendingItem.save();
    await findUser.save();

    return findPendingItem;
  }
  // async blockPendingItem(userId) {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   const findUser = await account.findOne({ _id: userId }).session(session);
  //   if (!findUser) {
  //     const error = new Error("Account not Found");
  //     error.status = 404;
  //     throw error;
  //   }

  //   const pendingItem = await pendingApprove.findOne({
  //     accountID: userId,
  //   });

  //   pendingItem.status = status.BLOCKED;
  //   await pendingItem.save();

  //   findUser.statusAccount = statusAccount.BLOCKED;
  //   await findUser.save();

  //   return pendingItem;
  // }

  // async unBlockPendingItem(userId) {
  //   const findUser = await account.findOne({ _id: userId });
  //   if (!findUser) {
  //     const error = new Error("Account not Found");
  //     error.status = 404;
  //     throw error;
  //   }

  //   const pendingItem = await pendingApprove.findOne({
  //     accountID: userId,
  //   });

  //   pendingItem.status = status.PENDING;
  //   await pendingItem.save();

  //   return pendingItem;
  // }

  async deletePendingItems(pendingItemsId) {
    const result = await pendingApprove.deleteOne({ _id: pendingItemsId });
    if (result.deletedCount === 0) {
      const error = new Error("Pending item not found");
      error.status = 404;
      throw error;
    }
    return result;
  }
}

export default new pendingApproveService();
