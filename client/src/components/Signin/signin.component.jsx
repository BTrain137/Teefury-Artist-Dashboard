import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { Link, withRouter } from "react-router-dom";

import { areFormFieldsValid } from "../../utils";
import { clearUserError, signInStart } from "../../redux/user/user.action";
import { selectCurrentUser } from "../../redux/user/user.selector";

import { Form, FormInput } from "../FormInput/form-input.component";
import { ButtonMd } from "../Button/button.component";
import SignInSignUpError from "../SigninSignUpError";

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
      formPasswordError: "",
      formEmailError: "",
      isDisableSubmit: false,
      isFormValid: true,
    };
  }

  componentDidMount() {
    const { basicArtistInfo, clearReduxUserErrors } = this.props;
    clearReduxUserErrors();
    if (basicArtistInfo) this._redirectUser(basicArtistInfo);
  }

  shouldComponentUpdate(nextProps) {
    const { basicArtistInfo } = nextProps;
    if (basicArtistInfo) {
      this._redirectUser(basicArtistInfo);
      return false;
    } else {
      return true;
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, isDisableSubmit: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    const { signInStart, clearReduxUserErrors } = this.props;

    const { contactEmail, password } = this.state;
    const doesFromHaveErrors = areFormFieldsValid(contactEmail, password);

    clearReduxUserErrors();

    if (doesFromHaveErrors) {
      const { ...errorMsgs } = doesFromHaveErrors;
      this.setState({
        ...errorMsgs,
        isDisableSubmit: true,
      });
    } else {
      this.setState({
        formPasswordError: "",
        formEmailError: "",
        isDisableSubmit: true,
      });
      signInStart(contactEmail.trim(), password.trim());
    }
  };

  handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      this.handleSubmit(event);
    }
  };

  _redirectUser = (basicArtistInfo) => {
    const { history } = this.props;
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
      formEmailError,
      formPasswordError,
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

        <Form onSubmit={this.handleSubmit} onKeyPress={this.handleFormKeyPress}>
          {formEmailError ? (
            <ErrorMessages>{formEmailError}</ErrorMessages>
          ) : (
            <SignInSignUpError />
          )}
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
          {formPasswordError ? (
            <ErrorMessages>{formPasswordError}</ErrorMessages>
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
  clearReduxUserErrors: () => dispatch(clearUserError()),
  signInStart: (contactEmail, password) =>
    dispatch(signInStart({ contactEmail, password })),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Signin));
