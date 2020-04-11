import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { createStructuredSelector } from "reselect";
import { Link, withRouter } from "react-router-dom";

import { isEmailValid, isPasswordStrong } from "../../utils";
import { setCurrentUser, setUserJWTToken } from "../../redux/user/user.action";
import { selectCurrentUser } from "../../redux/user/user.selector";

import { Form, FormInput } from "../FormInput/form-input.component";
import { ButtonMd } from "../Button/button.component";

import {
  SignUpContainer,
  H1,
  H2,
  H3,
  Img,
  ErrorMessages,
  SpaceHolder,
} from "./signin.styles.jsx";
import logo from "../../assets/logo.png";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactEmail: "",
      password: "",
      errorStatus: "",
      emailError: "",
      passwordError: "",
      isDisableSubmit: false,
      resetEmailURL: "",
    };
  }

  componentDidMount() {
    this._redirectUser();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, isDisableSubmit: false });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    const { contactEmail, password } = this.state;
    if (this._areFormFieldsValid(contactEmail, password)) {
      await this._signUserIn(contactEmail, password);
      this._redirectUser();
    }
  };

  handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      this.handleSubmit(event);
    }
  };

  _areFormFieldsValid = (contactEmail, password) => {
    const errorObj = {
      passwordError: "",
      emailError: "",
      isFormValid: true,
    };

    if (!isPasswordStrong(password)) {
      errorObj.passwordError = "Password must be at least 5 characters long.";
      errorObj.isFormValid = false;
    }

    if (!isEmailValid(contactEmail)) {
      errorObj.emailError = "Please Enter A Valid Email";
      errorObj.isFormValid = false;
    }

    if (!errorObj.isFormValid) {
      this.setState(errorObj);
      return false;
    } else {
      return true;
    }
  };

  _signUserIn = async (contactEmail, password) => {
    const { setCurrentUser, setUserJWTToken } = this.props;
    try {
      const { data } = await axios.post("/api/signin-user", {
        contactEmail: contactEmail.trim(),
        password: password.trim(),
      });
      const { token, currentUser } = data;
      setUserJWTToken(token);
      setCurrentUser(currentUser);
    } catch (error) {
      const { status, message } = error.response.data;
      const teefuryEmail = "artist@teefury.com";
      const emailSubject = "Reset User Account";
      const msgToArtist = `Artist! Please send this email from the same inbox you are requesting the password to be reset.\nFor your account security sender email must match ${contactEmail}.\nMissed match sender email and account email will be ignored.`;
      const emailBody = `Hello Teefury Team,\n\nPlease reset the password associated to the email, ${contactEmail}\n\n${msgToArtist}\n\nThank you!`;
      const resetEmailURL = encodeURI(
        `mailto:${teefuryEmail}?subject=${emailSubject}&body=${emailBody}`
      );
      this.setState({
        emailError: message,
        errorStatus: status,
        passwordError: "",
        resetEmailURL,
        isDisableSubmit: true,
      });
    }
  };

  _redirectUser = () => {
    const { basicArtistInfo, history } = this.props;
    // Component did mount will execute this immediately
    if (!basicArtistInfo) {
      return;
    } else {
      const { artistName, contactEmail } = basicArtistInfo;
      if (!contactEmail) {
        return;
      } else if (contactEmail && artistName) {
        history.push("/artist/profile");
      } else if (contactEmail && !artistName) {
        history.push("/artist/create");
      }
    }
  };

  render() {
    const {
      contactEmail,
      password,
      emailError,
      errorStatus,
      passwordError,
      isDisableSubmit,
      resetEmailURL,
    } = this.state;

    return (
      <SignUpContainer>
        <H1>Welcome!</H1>
        <H2>
          <Img src={logo} alt="Teefury Logo" />
          Tee<b>Fury</b>
        </H2>
        <H3>Dashboard</H3>

        <Form onSubmit={this.handleSubmit} onKeyPress={this.handleFormKeyPress}>
          {emailError ? (
            <ErrorMessages>{emailError} </ErrorMessages>
          ) : (
            <SpaceHolder />
          )}
          {errorStatus === 404 ? (
            <ErrorMessages>
              <a target="_blank" rel="noopener noreferrer" href={resetEmailURL}>
                {" "}
                Reset Password
              </a>
            </ErrorMessages>
          ) : null}
          <FormInput
            type="email"
            name="contactEmail"
            label="contact_email"
            placeholder="Contact Email"
            style={{ fontSize: "16px", marginBottom: "10px" }}
            handleChange={this.handleChange}
            value={contactEmail}
            required
          />
          {passwordError ? (
            <ErrorMessages>{passwordError} </ErrorMessages>
          ) : (
            <SpaceHolder />
          )}
          <FormInput
            type="password"
            name="password"
            label="password"
            placeholder="Password"
            style={{ fontSize: "16px", marginBottom: "10px" }}
            handleChange={this.handleChange}
            value={password}
            required
          />
          <ButtonMd
            type="submit"
            disabled={isDisableSubmit}
            style={{ width: "110px" }}
          >
            Sign In
          </ButtonMd>
        </Form>
        <div style={{ marginTop: "20px" }}>
          <Link to="/signup">Don't have an account? Sign Up!</Link>
        </div>
      </SignUpContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  basicArtistInfo: selectCurrentUser,
});

const mapDispatchToProps = (dispatch) => ({
  setUserJWTToken: (token) => dispatch(setUserJWTToken(token)),
  setCurrentUser: (currentUser) => dispatch(setCurrentUser(currentUser)),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
