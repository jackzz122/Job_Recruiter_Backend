import pendingApprove from "../models/pendingApprove.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import { status } from "../models/pendingApprove.js";

class pendingApproveService {
  async getPendingList() {
    const pendingList = await pendingApprove
      .find()
      .populate({ path: "accountID", select: "fullname email avatarImg" });

    if (pendingList.length === 0) {
      const error = new Error("Not found any pending list");
      error.status = 404;
      throw error;
    }

    return pendingList;
  }

  async confirmPendingItem(userId, companyData) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not found");
      error.status = 404;
      throw error;
    }

    const pendingItem = await pendingApprove.findOne({
      accountID: userId,
    });

    pendingItem.status = status.APPROVE;
    await pendingItem.save();

    const newCompany = new company({
      ...companyData,
    });
    await newCompany.save();

    findUser.role = RoleName.Recruit;
    findUser.companyId = newCompany._id;
    await findUser.save();

    return pendingItem;
  }

  async blockPendingItem(userId) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not Found");
      error.status = 404;
      throw error;
    }

    const pendingItem = await pendingApprove.findOne({
      accountID: userId,
    });

    pendingItem.status = status.BLOCKED;
    await pendingItem.save();

    return pendingItem;
  }

  async unBlockPendingItem(userId) {
    const findUser = await account.findOne({ _id: userId });
    if (!findUser) {
      const error = new Error("Account not Found");
      error.status = 404;
      throw error;
    }

    const pendingItem = await pendingApprove.findOne({
      accountID: userId,
    });

    pendingItem.status = status.PENDING;
    await pendingItem.save();

    return pendingItem;
  }

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
