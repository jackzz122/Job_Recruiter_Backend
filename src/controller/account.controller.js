import account from "../models/account.model.js";

import * as _ from "lodash";

export const createUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existAccount = await findOneAccount({ email });

    if (existAccount) {
      return res.status(400).json({
        message: "Account existed",
      });
    }

    const saltRounds = 10;
    const hash = bcrypt.hashSync(password, saltRounds);
    req.body.password = hash;

    const userAccount = new account({
      ...req.body,
      role: "guest",
    });

    await userAccount.save();

    return res.json({
      message: "Create Account successfully",
    });
  } catch (err) {
    next(err);
  }
};
