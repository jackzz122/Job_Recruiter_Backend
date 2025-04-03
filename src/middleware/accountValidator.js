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
export const recruiterRegisValidator = {
  companyName: {
    errorMessage: "Please enter a company name",
  },
  email: {
    isEmail: {
      errorMessage: "Please enter a valid email address",
    },
  },
  phoneNumber: {
    errorMessage: "Please enter a phone number",
  },
  address: {
    errorMessage: "Please enter a address",
  },
  websiteUrl: {
    errorMessage: "Please enter a website url",
  },
};
