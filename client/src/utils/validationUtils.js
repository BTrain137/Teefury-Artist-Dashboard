export const isPasswordStrong = (password) => {
  return password.length < 6 ? false : true;
};

export const isEmailValid = (contactEmail) => {
  const valid_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return valid_email.test(contactEmail);
};

export const isNameValid = (name) => {
  var valid_name = /^[a-zA-Z_\- ]+$/;
  return valid_name.test(name);
};

export const doesPasswordMatch = (oldString, newString) => {
  return oldString === newString ? true : false;
};

export const areFormFieldsValid = (contactEmail, password) => {
  const error = {
    formPasswordError: "",
    formEmailError: "",
    formHasErrors: false,
  };

  if (!isPasswordStrong(password)) {
    error.formPasswordError = "Password must be at least 5 characters long.";
    error.formHasErrors = true;
  }

  if (!isEmailValid(contactEmail)) {
    error.formEmailError = "Please Enter A Valid Email";
    error.formHasErrors = true;
  }

  if (error.formHasErrors) {
    const { formPasswordError, formEmailError } = error;
    return {
      formPasswordError,
      formEmailError,
    };
  } else {
    return false;
  }
};
