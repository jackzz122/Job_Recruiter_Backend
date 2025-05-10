import { apiResponse } from "../helper/response.helper.js";
import pendingApproveService from "../services/pendingApprove.service.js";

export const getPendingList = async (req, res, next) => {
  try {
    const pendingList = await pendingApproveService.getPendingList();
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
    const pendingItem = await pendingApproveService.confirmPendingItem(
      req.params.userId,
      req.body
    );
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
    const pendingItem = await pendingApproveService.blockPendingItem(
      req.params.userId
    );
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
    const pendingItem = await pendingApproveService.unBlockPendingItem(
      req.params.userId
    );
    const response = apiResponse.success(
      pendingItem,
      "Company unblocked successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};

export const deletePendingItems = async (req, res, next) => {
  try {
    await pendingApproveService.deletePendingItems(req.params.pendingItemsId);
    return res
      .status(204)
      .json({ message: "Pending items deleted successfully" });
  } catch (err) {
    next(err);
  }
};
