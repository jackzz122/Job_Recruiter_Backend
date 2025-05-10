import comment from "../models/comments.model.js";
import { apiResponse } from "../helper/response.helper.js";
import commentService from "../services/comment.service.js";
export const createComment = async (req, res, next) => {
  try {
    const newComment = await commentService.createComment(
      req.user._id,
      req.body.company_id,
      req.body
    );
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
    const companyComments = await commentService.getComments(
      req.params.companyId
    );
    const response = apiResponse.created(
      companyComments,
      "List comments found"
    );
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
export const updateComment = async (req, res, next) => {};
export const alertComment = async (req, res, next) => {};
export const DeleteComment = async (req, res, next) => {
  try {
    const commentRes = await commentService.deleteComment(req.params.commentId);
    const response = apiResponse.success(commentRes, "Delete comment success");
    return res.status(response.status).json(response.body);
  } catch (err) {
    next(err);
  }
};
