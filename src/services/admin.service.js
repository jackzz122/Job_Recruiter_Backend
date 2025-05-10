import account from "../models/account.model.js";
import { RoleName } from "../models/account.model.js";

class adminService {
  async getListUsers() {
    const listAccount = await account.find({}, { password: 0 });
    if (listAccount.length === 0) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }
    return listAccount;
  }

  async getListRecruiter(companyId) {
    const listRecruiter = await account.find({
      role: RoleName.STAFF_RECRUIT,
      companyId: companyId,
    });
    if (listRecruiter.length === 0) {
      const error = new Error("Not found any list users");
      error.status = 404;
      throw error;
    }
    return listRecruiter;
  }
}

export default new adminService();
