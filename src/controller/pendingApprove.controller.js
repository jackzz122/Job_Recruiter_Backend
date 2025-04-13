import pendingApprove from "../models/pendingApprove.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
import { status } from "../models/pendingApprove.js";
import { apiResponse } from "../helper/response.helper.js";
export const getPendingList = async (req, res, next) => {
  try {
    const pendingList = await pendingApprove
      .find()
      .populate({ path: "accountID", select: "fullname email avatarImg" });
    if (pendingList.length === 0) {
      const response = apiResponse.notFoundList("Not found any pending list");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(
      pendingList,
      "Get pending list success"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const confirmPendingItem = async (req, res, next) => {
  try {
    const findUser = await account.findOne({ _id: req.params.userId });
    if (!findUser) {
      const response = apiResponse.notFound("Account not found");
      return res.status(response.status).json(response.body);
    }
    const pendingItem = await pendingApprove.findOne({
      accountID: req.params.userId,
    });
    pendingItem.status = status.APPROVE;
    await pendingItem.save();
    const newCompany = new company({
      ...req.body,
    });
    await newCompany.save();
    findUser.role = RoleName.Recruit;
    findUser.companyId = newCompany._id;
    await findUser.save();
    const response = apiResponse.created(
      pendingItem,
      "Company created successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const blockPendingItem = async (req, res, next) => {
  try {
    const findUser = await account.findOne({ _id: req.params.userId });
    if (!findUser) {
      const response = apiResponse.notFound("Account not Found");
      return res.status(response.status).json(response.body);
    }
    const pendingItem = await pendingApprove.findOne({
      accountID: req.params.userId,
    });
    pendingItem.status = status.BLOCKED;
    await pendingItem.save();
    const response = apiResponse.success(
      pendingItem,
      "Company blocked successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const unBlockPendingItem = async (req, res, next) => {
  try {
    const findUser = await account.findOne({ _id: req.params.userId });
    if (!findUser) {
      const response = apiResponse.notFound("Account not Found");
      return res.status(response.status).json(response.body);
    }
    const pendingItem = await pendingApprove.findOne({
      accountID: req.params.userId,
    });
    pendingItem.status = status.PENDING;
    await pendingItem.save();
    const response = apiResponse.success(
      pendingItem,
      "Company blocked successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const deletePendingItems = async (req, res, next) => {
  try {
    const id = req.params.pendingItemsId;
    await pendingApprove.deleteOne({ _id: id });
    return res
      .status(204)
      .json({ message: "Pending items deleted successfully" });
  } catch (err) {
    next(err);
  }
};
