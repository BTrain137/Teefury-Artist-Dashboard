import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import { isEmailValid } from "../../utils";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

import { Form, FormInput } from "../FormInput";
import { ButtonMd } from "../Button";
import {
  SignUpContainer,
  H1,
  H2,
  H3,
  H4,
  Img,
  ErrorMessages,
} from "../SharedStyle/signin-signout.styles";
import logo from "../../assets/logo.png";

const ResetPassword = () => {
  const [state, setState] = useState({
    contactEmail: "",
    errorMessage: "",
    successMessage: "",
    isDisableSubmit: false,
    isLoading: false,
  });

  const {
    contactEmail,
    errorMessage,
    isDisableSubmit,
    successMessage,
    isLoading,
  } = state;

  const sendResetEmail = async () => {
    try {
      await axios.post("/api/user/forgot-password", {
        contactEmail,
      });
      setState({
        ...state,
        successMessage: "Please Check your inbox for the rest email.",
        errorMessage: "",
        isDisableSubmit: true,
      });
    } catch (error) {
      console.log(error.response);
      setState({
        ...state,
        errorMessage:
          "Email Address Not Found. Maybe You don't have an account with us.",
        successMessage: "",
        isDisableSubmit: true,
      });
    }
  };

  const resetUserPassword = () => {
    if (!isEmailValid(contactEmail)) {
      setState({
        ...state,
        errorMessage: "Please Enter A Valid Email.",
        isDisableSubmit: true,
      });
    } else {
      setState({
        ...state,
        isDisableSubmit: true,
        isLoading: true,
      });
      sendResetEmail();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value, isDisableSubmit: false });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    resetUserPassword();
  };

  const handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();
      resetUserPassword();
    }
  };

  return (
    <SignUpContainer>
      <H1>Welcome!</H1>
      <H2>
        <Img src={logo} alt="Teefury Logo" />
        Tee<b>Fury</b>
      </H2>
      <H3>Dashboard</H3>
      <H4>RESET PASSWORD</H4>
      <span style={{ display: "block", minHeight: "40px" }}>
        <h5 style={{ color: "red" }}>{successMessage}</h5>
        {errorMessage ? <ErrorMessages>{errorMessage}</ErrorMessages> : null}
      </span>
      <Form onSubmit={handleSubmit} onKeyPress={handleFormKeyPress}>
        <FormInput
          type="email"
          name="contactEmail"
          label="contact_email"
          placeholder="Contact Email"
          style={{ fontSize: "16px", marginBottom: "10px" }}
          handleChange={handleChange}
          value={contactEmail}
          required
        />
        <ButtonMd
          type="submit"
          disabled={isDisableSubmit}
          style={{ width: "190px", height: "44px" }}
        >
          {isLoading ? <LoadingIcon /> : "Reset Password"}
        </ButtonMd>
      </Form>
      <div style={{ marginTop: "20px" }}>
        <Link to="/signup">Don't have an account? Sign Up!</Link>
      </div>
    </SignUpContainer>
  );
};

export default ResetPassword;
