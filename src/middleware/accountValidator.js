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
