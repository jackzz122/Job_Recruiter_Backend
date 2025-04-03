import pendingApprove from "../models/pendingApprove.js";
import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";
import company from "../models/companyInfor.model.js";
export const getPendingList = async (req, res, next) => {
  try {
    const pendingList = await pendingApprove
      .find()
      .populate({ path: "accountID", select: "fullname email avatarImg" });
    if (pendingList.length === 0)
      return res.status(404).json({ message: "pending list not found" });
    return res.json(pendingList);
  } catch (err) {
    next(err);
  }
};

export const confirmPendingItem = async (req, res, next) => {
  try {
    const findUser = await account.findOne({ _id: req.params.userId });
    if (!findUser) {
      return res.status(404).json({ message: "Account not found" });
    }
    const newCompany = new company({
      ...req.body,
    });
    await newCompany.save();
    findUser.role = RoleName.Recruit;
    findUser.companyId = newCompany._id;
    findUser.status = "active";
    await findUser.save();
    return res.json({ message: "Company created successfully" });
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
