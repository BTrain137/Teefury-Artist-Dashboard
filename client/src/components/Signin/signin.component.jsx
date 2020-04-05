import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { createStructuredSelector } from "reselect";
import { Link, withRouter } from "react-router-dom";

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

    if (!this._isPasswordStrong(password)) {
      errorObj.passwordError = "Password must be at least 5 characters long.";
      errorObj.isFormValid = false;
    }

    if (!this._isEmailValid(contactEmail)) {
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

  _isPasswordStrong = (password) => {
    return password.length < 6 ? false : true;
  };

  _isEmailValid = (contactEmail) => {
    const valid_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return valid_email.test(contactEmail);
  };

  _signUserIn = async (contactEmail, password) => {
    const { setCurrentUser, setUserJWTToken } = this.props;
    try {
      const { data } = await axios.post("/api/login-user", {
        contactEmail,
        password,
      });
      const { token, currentUser } = data;
      setUserJWTToken(token);
      setCurrentUser(currentUser);
    } catch (error) {
      const { status, message } = error.response.data;
      this.setState({
        emailError: message,
        errorStatus: status,
        passwordError: "",
        isDisableSubmit: true,
      });
    }
  };

  _redirectUser = () => {
    const { basicArtistInfo, history } = this.props;
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
    } = this.state;

    return (
      <SignUpContainer>
        <H1>Welcome!</H1>
        <H2>
          <Img src={logo} alt="Teefury Logo" />
          Tee<b>Fury</b>
        </H2>
        <H3>Dashboard</H3>

        <Form
          onSubmit={this.handleSubmit}
          // onKeyPress={this.handleFormKeyPress}
        >
          {emailError ? (
            <ErrorMessages>{emailError} </ErrorMessages>
          ) : (
            <SpaceHolder />
          )}
          {errorStatus === 404 ? (
            <ErrorMessages>
              <Link to="/artist/reset-password"> Reset Password</Link>
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

const mapDispatchToProps = (dispatch) => ({
  setUserJWTToken: (token) => dispatch(setUserJWTToken(token)),
  setCurrentUser: (currentUser) => dispatch(setCurrentUser(currentUser)),
});

const mapStateToProps = createStructuredSelector({
  basicArtistInfo: selectCurrentUser,
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
