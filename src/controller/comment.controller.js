import comment from "../models/comments.model.js";
import { apiResponse } from "../helper/response.helper.js";
export const createComment = async (req, res, next) => {
  try {
    const user_Id = req.user._id;
    const commentList = comment.findOne({ account_id: user_id });
    if (commentList) {
      return res.status(400).json({ message: "You have already commented" });
    }
    const newComment = new comment({
      ...req.body,
      account_id: user_Id,
    });
    await newComment.save();
    const response = apiResponse.success(
      newComment,
      "Comment created successfully"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const getCommentCompanies = async (req, res, next) => {
  try {
    const companyComments = await comment
      .find({ company_id: req.params.companyId })
      .populate("account_id");
    if (companyComments.length === 0) {
      const response = apiResponse.notFoundList("Comment list found");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.created(
      companyComments,
      "List comments found"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const alertComment = async (req, res, next) => {};
export const DeleteComment = async (req, res, next) => {
  try {
    const companyId = req.params.commentId;
    const commentRes = await comment.findOne({ companyId: companyId });
    if (commentRes.length === 0) {
      const response = apiResponse.notFound("Comment list not found");
      return res.status(response.status).json(response.body);
    }
    const response = apiResponse.success(commentRes, "Delete comment success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
