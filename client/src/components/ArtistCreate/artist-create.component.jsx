import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { setCurrentUser, deleteUserStart } from "../../redux/user/user.action";
import {
  selectCurrentUser,
  selectUserJWTToken,
} from "../../redux/user/user.selector";

import { Form, FormInput } from "../FormInput/form-input.component";
import { ButtonMd } from "../Button/button.component";
import {
  CheckboxesContainer,
  Checkbox,
  Label,
} from "../CheckBox/checkbox.component";

import {
  SignUpContainer,
  H1,
  H2,
  H3,
  P,
  Span,
  Img,
  Terms,
  LinkToTerm,
  ErrorTitle,
  ErrorList,
} from "./artist-create.styles.jsx";
import logo from "../../assets/logo.png";

class CreateArtist extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artistName: "",
      firstName: "",
      lastName: "",
      contactEmail: "",
      paypalEmail: "",
      phoneNumber: "",
      socialFacebook: "",
      socialInstagram: "",
      socialTwitter: "",
      isInternational: true,
      hasAcceptTerms: false,
      errorMessages: [],
      errorStatus: "",
      isDisableSubmit: false,
    };
  }

  componentDidMount() {
    const { basicArtistInfo } = this.props;
    this._loadBasicArtistInfo(basicArtistInfo);
    this._redirectUser(basicArtistInfo);
  }

  shouldComponentUpdate(nextProps) {
    const { basicArtistInfo } = nextProps;
    return this._redirectUser(basicArtistInfo);
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (event) => {
    // TODO: Move submit into saga and fixed redirecting here
    // Possibly as simple as removing it.
    event.preventDefault();
    await this._createArtistAccount();
    this._redirectUser();
  };

  handleFormKeyPress = (event) => {
    if (event.which === 13) {
      event.preventDefault();
      this.handleSubmit(event);
    }
  };

  handleClick = () => {
    const { deleteUserStart, token } = this.props;
    deleteUserStart(token);
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleToggleCheckBox = (event) => {
    const {
      name,
      dataset: { bool },
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    this.setState({ [name]: boolValue });
  };

  _loadBasicArtistInfo = (basicArtistInfo) => {
    if (basicArtistInfo) {
      const { contactEmail } = basicArtistInfo;
      if (contactEmail) {
        this.setState({ contactEmail });
      }
    }
  };

  _createArtistAccount = async () => {
    const {
      artistName,
      firstName,
      lastName,
      contactEmail,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
      hasAcceptTerms,
    } = this.state;

    const { token, updateArtistInfo } = this.props;

    try {
      const reqBody = {
        artistName,
        firstName,
        lastName,
        contactEmail,
        paypalEmail,
        phoneNumber,
        socialFacebook,
        socialInstagram,
        socialTwitter,
        isInternational,
        hasAcceptTerms,
      };

      if (
        this._areFormFieldsValid(
          artistName,
          firstName,
          lastName,
          paypalEmail,
          hasAcceptTerms
        )
      ) {
        const {
          data: { currentUser },
        } = await axios.post("/api/artist-profile-create", reqBody, {
          headers: { Authorization: `JWT ${token}` },
        });
        updateArtistInfo({ ...currentUser });
      }
    } catch (error) {
      const { status, message } = error.response.data;
      this.setState({
        errorMessages: [message],
        errorStatus: status,
        isDisableSubmit: true,
      });
    }
  };

  _areFormFieldsValid = (
    artistName,
    firstName,
    lastName,
    paypalEmail,
    hasAcceptTerms
  ) => {
    const errorObj = {
      errorMessages: [],
      _isFormValid: true,
    };

    // TODO: Validate artistName properly
    console.log(artistName.length);
    if (artistName.length < 3) {
      errorObj.errorMessages.push(
        "Artist name must be longer than 2 characters"
      );
      errorObj._isFormValid = false;
    }

    if (!this._isNameValid(lastName)) {
      errorObj.errorMessages.push("Please Enter A Valid Last Name.");
      errorObj._isFormValid = false;
    }

    if (!this._isNameValid(firstName)) {
      errorObj.errorMessages.push("Please Enter A Valid First Name.");
      errorObj._isFormValid = false;
    }

    if (!this._isEmailValid(paypalEmail)) {
      errorObj.errorMessages.push(
        "Please Enter A Valid Email For Paypal Email."
      );
      errorObj._isFormValid = false;
    }

    if (!hasAcceptTerms) {
      errorObj.errorMessages.push(
        "Please read and agree to the terms and conditions."
      );
      errorObj._isFormValid = false;
    }

    if (!errorObj._isFormValid) {
      this.setState(errorObj);
      return false;
    } else {
      return true;
    }
  };

  _isEmailValid = (email) => {
    const valid_email = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return valid_email.test(email);
  };

  _isNameValid = (name) => {
    var valid_name = /^[a-zA-Z_\- ]+$/;
    return valid_name.test(name);
  };

  _redirectUser = (basicArtistInfo) => {
    const { history } = this.props;
    if (basicArtistInfo) {
      const { artistName } = basicArtistInfo;
      if (artistName) {
        history.push("/artist/profile");
        return false;
      } else {
        return true;
      }
    } else {
      history.push("/");
      return false;
    }
  };

  render() {
    const {
      artistName,
      firstName,
      lastName,
      contactEmail,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
      hasAcceptTerms,
      errorMessages,
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
        {errorMessages.length > 0 ? (
          <ErrorList>
            <ErrorTitle>Please Correct Error(s)</ErrorTitle>
            {errorMessages.map((errMsg, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: errMsg }} />
            ))}
          </ErrorList>
        ) : (
          <div style={{ height: "85px" }} />
        )}
        <Form
          onSubmit={this.handleSubmit}
          style={{ display: "flex", marginTop: "0" }}
          onKeyPress={this.handleFormKeyPress}
        >
          <div style={{ flexBasis: "50%" }}>
            <FormInput
              type="text"
              name="artistName"
              label="Artist Name"
              placeholder="@Artist Name"
              style={{ fontSize: "21px" }}
              handleChange={this.handleChange}
              value={artistName}
              required
            />
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={firstName}
              required
            />
            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={lastName}
              required
            />
            <FormInput
              type="email"
              name="contactEmail"
              label="contact_email"
              placeholder="Contact Email"
              style={{ fontSize: "15px" }}
              // handleChange={this.handleChange}
              value={contactEmail}
              required
              disabled
            />
            <FormInput
              type="email"
              name="paypalEmail"
              label="Paypal Email"
              placeholder="Paypal Email"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={paypalEmail}
              required
            />
            <FormInput
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={phoneNumber}
              required
            />
            <FormInput
              type="text"
              name="socialFacebook"
              label="Facebook"
              placeholder="Facebook Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={socialFacebook}
            />
            <FormInput
              type="text"
              name="socialInstagram"
              label="Instagram"
              placeholder="Instagram Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={socialInstagram}
            />
            <FormInput
              type="text"
              name="socialTwitter"
              label="Twitter"
              placeholder="Twitter Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={socialTwitter}
            />
          </div>
          <div style={{ flexBasis: "50%", textAlign: "left", display: "flex" }}>
            <div
              style={{
                display: "inline-block",
                margin: "0 auto",
                minWidth: "233px",
              }}
            >
              <P>INTERNATIONAL?</P>
              <CheckboxesContainer>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={true}
                    checked={isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <Span>Yes</Span>
                </Label>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={false}
                    checked={!isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <Span>No</Span>
                </Label>
              </CheckboxesContainer>
              <div style={{ display: "flex" }}>
                <label>
                  <Checkbox
                    name="hasAcceptTerms"
                    checked={hasAcceptTerms}
                    onChange={this.handleCheckboxChange}
                    required
                  />
                </label>
                <Terms>
                  I have read and accepted <br />
                  <LinkToTerm to="/artist/profile">
                    terms and conditions
                  </LinkToTerm>
                </Terms>
              </div>
              <ButtonMd type="submit" disabled={isDisableSubmit}>
                Create Profile
              </ButtonMd>
              <ButtonMd type="button" onClick={this.handleClick}>
                Take me back
              </ButtonMd>
            </div>
          </div>
        </Form>
      </SignUpContainer>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateArtistInfo: (basicInfo) => dispatch(setCurrentUser(basicInfo)),
  deleteUserStart: (token) => dispatch(deleteUserStart({ token })),
});

const mapStateToProps = createStructuredSelector({
  basicArtistInfo: selectCurrentUser,
  token: selectUserJWTToken,
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(CreateArtist)
);
