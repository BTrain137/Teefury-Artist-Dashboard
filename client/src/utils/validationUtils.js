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

export const areUserFormFieldsValid = (contactEmail, password) => {
  const error = {
    formPasswordError: "",
    formEmailError: "",
    _formHasErrors: false,
  };

  if (!isPasswordStrong(password)) {
    error.formPasswordError = "Password must be at least 5 characters long.";
    error._formHasErrors = true;
  }

  if (!isEmailValid(contactEmail)) {
    error.formEmailError = "Please Enter A Valid Email";
    error._formHasErrors = true;
  }

  if (error._formHasErrors) {
    const { formPasswordError, formEmailError } = error;
    return {
      formPasswordError,
      formEmailError,
    };
  } else {
    return false;
  }
};

export const areArtistFormFieldsValid = ({
  artistName,
  firstName,
  lastName,
  paypalEmail,
  hasAcceptTerms,
}) => {
  const error = {
    errorMessages: [],
    _formHasErrors: false,
  };

  // TODO: Validate artistName properly
  if (artistName.length < 3) {
    error.errorMessages.push("Artist name must be longer than 2 characters");
    error._formHasErrors = true;
  }

  if (!isNameValid(lastName)) {
    error.errorMessages.push("Please Enter A Valid Last Name.");
    error._formHasErrors = true;
  }

  if (!isNameValid(firstName)) {
    error.errorMessages.push("Please Enter A Valid First Name.");
    error._formHasErrors = true;
  }

  if (!isEmailValid(paypalEmail)) {
    error.errorMessages.push("Please Enter A Valid Email For Paypal Email.");
    error._formHasErrors = true;
  }

  if (!hasAcceptTerms) {
    error.errorMessages.push(
      "Please read and agree to the terms and conditions."
    );
    error._formHasErrors = true;
  }

  if (error._formHasErrors) {
    const { errorMessages } = error;
    return { errorMessages };
  } else {
    return false;
  }
};
