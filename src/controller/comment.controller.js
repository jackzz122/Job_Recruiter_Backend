import comment from "../models/comments.model.js";
export const createComment = async (req, res, next) => {
  try {
    const user_Id = req.userId;
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
    const company_Id = req.params.companyId;
    const companyComments = await comment.find({_id: company_Id});
    if (companyComments.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }
    return res.json({ commentList: companyComments });
  } catch (err) {
    next(err);
  }
};
export const alertComment = async (req, res, next) => {
  
}
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
