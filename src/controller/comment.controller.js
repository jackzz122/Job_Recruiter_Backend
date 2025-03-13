import comment from "./comment.controller";

export const getComments = async () => {};
export const createComment = async (req, res, next) => {
  try {
    const { body } = req;
  } catch (err) {
    next(err);
  }
};
export const getDetailsComment = async (req, res, next) => {
  try {
    const { body } = req;
  } catch (err) {
    next(err);
  }
};
export const DeleteComment = async (req, res, next) => {
  try {
    const { body } = req;
  } catch (err) {
    next(err);
  }
};
