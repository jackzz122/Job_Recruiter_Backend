import comment from "../models/comments.model.js";
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
    return res.status(201).json({ message: "Comment created successfully" });
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
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.json(companyComments);
  } catch (err) {
    next(err);
  }
};
export const alertComment = async (req, res, next) => {};
export const DeleteComment = async (req, res, next) => {
  try {
    const companyId = req.params.commentId;
    const commentRes = await comment.findOne({ companyId: companyId });
    if (commentRes.length === 0)
      return res.status(404).json({ message: "Comment not found" });
    return res.json({ message: "Comment deleted" });
  } catch (err) {
    next(err);
  }
};
