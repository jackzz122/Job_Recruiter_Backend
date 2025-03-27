export const accountValidator = {
  email: {
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Please enter a password",
    },
  },
};
export const accountRegisterValidator = {
  fullname: {
    errorMessage: "Please enter a full name",
  },
  email: {
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
  },
  password: {
    notEmpty: {
      errorMessage: "Please enter a password",
    },
  },
};
