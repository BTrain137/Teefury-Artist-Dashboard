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
