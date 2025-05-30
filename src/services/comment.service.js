import commentsModel from "../models/comments.model.js";
class commentService {
  async createComment(accountId, companyId, content) {
    const Hascomment = await commentsModel.findOne({
      account_id: accountId,
      company_id: companyId,
    });
    console.log(content);
    if (Hascomment) {
      const err = new Error("You have already commented on this company");
      err.status = 400;
      throw err;
    }
    const newComment = new commentsModel({
      ...content,
      account_id: accountId,
      company_id: companyId,
    });
    await newComment.save();
    return newComment;
  }
  async getComments(companyId) {
    const companyComments = await commentsModel
      .find({ company_id: companyId })
      .populate("account_id");
    if (!companyComments) {
      const err = new Error("Comment list not found");
      err.status = 404;
      throw err;
    }
    return companyComments;
  }

  async updateComment() {}
  async deleteComment(commentId) {
    const deleteComment = await commentsModel.findByIdAndDelete(commentId);
    if (!deleteComment) {
      const err = new Error("Comment list not found");
      err.status = 404;
      throw err;
    }
    return deleteComment;
  }
}

export default new commentService();
