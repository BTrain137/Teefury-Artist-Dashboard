import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link, withRouter } from "react-router-dom";

import { setCurrentUser, setUserJWTToken } from "../../redux/user/user.action";

import { Form, FormInput } from "../FormInput/form-input.component";
import { ButtonMd } from "../Button/button.component";

import {
  SignUpContainer,
  H1,
  H2,
  H3,
  Img,
  ErrorMessages,
} from "./signup.styles.jsx";
import logo from "../../assets/logo.png";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactEmail: "",
      password: "",
      emailError: "",
      errorStatus: "",
      passwordError: "",
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const { contactEmail, password } = this.state;
    if (this._isPasswordStrong(password)) {
      this._createUser(contactEmail, password);
    } else {
      this.setState({ passwordError: "Password must be 5 characters long." });
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  _isPasswordStrong = (password) => {
    return password.length < 6 ? false : true;
  };

  _createUser = async (contactEmail, password) => {
    const { setCurrentUser, setUserJWTToken, history } = this.props;
    try {
      const { data } = await axios.post("/api/register-user", {
        contactEmail,
        password,
      });
      const { token, currentUser } = data;
      setUserJWTToken(token);
      setCurrentUser(currentUser);
      history.push("/artist/create");
    } catch (error) {
      const { status, message } = error.response.data;
      this.setState({ emailError: message, errorStatus: status });
    }
  };

  render() {
    const {
      contactEmail,
      password,
      emailError,
      errorStatus,
      passwordError,
    } = this.state;

    return (
      <SignUpContainer>
        <H1>Welcome!</H1>
        <H2>
          <Img src={logo} alt="Teefury Logo" />
          Tee<b>Fury</b>
        </H2>
        <H3>Dashboard</H3>

        <Form onSubmit={this.handleSubmit}>
          {emailError ? <ErrorMessages>{emailError} </ErrorMessages> : null}
          {errorStatus === 409 ? (
            <ErrorMessages>
              <Link to="/artist/reset-password"> Reset Password</Link>
            </ErrorMessages>
          ) : null}
          <FormInput
            type="email"
            name="contactEmail"
            label="contact_email"
            placeholder="Contact Email"
            style={{ fontSize: "16px" }}
            handleChange={this.handleChange}
            value={contactEmail}
            required
          />
          {passwordError ? (
            <ErrorMessages>{passwordError} </ErrorMessages>
          ) : null}
          <FormInput
            type="password"
            name="password"
            label="password"
            placeholder="Password"
            style={{ fontSize: "16px" }}
            handleChange={this.handleChange}
            value={password}
            required
          />
          <ButtonMd type="submit" style={{ width: "110px" }}>
            Sign Up
          </ButtonMd>
        </Form>
        <div style={{ marginTop: "20px" }}>
          <Link to="/">Already have an account? Login.</Link>
        </div>
      </SignUpContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  setUserJWTToken: (token) => dispatch(setUserJWTToken(token)),
  setCurrentUser: (currentUser) => dispatch(setCurrentUser(currentUser)),
});

export default withRouter(connect(null, mapDispatchToProps)(Signin));
