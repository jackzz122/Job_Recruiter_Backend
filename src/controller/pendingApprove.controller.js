import pendingApprove from "../models/pendingApprove";
import account from "../models/account.model";
export const getPendingList = (req, res, next) => {};

export const addPendingList = async (req, res, next) => {
  const userId = req.userId;
  const findUser = await account.findOne({ _id: userId });
  if (!findUser) {
    return res.status(404).json({ message: "Account not found" });
  }
  if (findUser.role !== "guest") {
    return res.status(404).json({ message: "You must create account first" });
  }

  const { body } = req;
};
