import React, { Component } from "react";

import { Form, FormInput } from "../FormInput/form-input.component";
import { ButtonMd } from "../Button/button.component";
import {
  CheckboxesContainer,
  Checkbox,
  Label
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
} from "./signup.styles.jsx";
import logo from "../../assets/logo.png";

class Signup extends Component {
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
      hasAcceptTerms: false
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

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
      hasAcceptTerms
    } = this.state;

    console.log(
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
      hasAcceptTerms
    );

    try {
      this.setState({
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
        hasAcceptTerms: false
      });
    } catch (error) {
      console.log("Sign In -> handle Submit", error);
    }
  };

  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleCheckboxChange = event => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  handleToggleCheckBox = event => {
    const {
      name,
      dataset: { bool }
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    this.setState({ [name]: boolValue });
  };

  render() {
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
          style={{ display: "flex" }}
        >
          <div style={{ flexBasis: "50%" }}>
            <FormInput
              type="text"
              name="artistName"
              label="Artist Name"
              placeholder="@Artist Name"
              style={{ fontSize: "21px" }}
              handleChange={this.handleChange}
              value={this.state.artistName}
              required
            />
            <FormInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="First Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.firstName}
              required
            />
            <FormInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.lastName}
              required
            />
            <FormInput
              type="email"
              name="contactEmail"
              label="contact_email"
              placeholder="Contact Email"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.contactEmail}
              required
            />
            <FormInput
              type="email"
              name="paypalEmail"
              label="Paypal Email"
              placeholder="Paypal Email"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.paypalEmail}
              required
            />
            <FormInput
              type="text"
              name="phoneNumber"
              label="Phone Number"
              placeholder="Phone Number"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.phoneNumber}
              required
            />
            <FormInput
              type="text"
              name="socialFacebook"
              label="Facebook"
              placeholder="Facebook Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.socialFacebook}
            />
            <FormInput
              type="text"
              name="socialInstagram"
              label="Instagram"
              placeholder="Instagram Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.socialInstagram}
            />
            <FormInput
              type="text"
              name="socialTwitter"
              label="Twitter"
              placeholder="Twitter Handle"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.socialTwitter}
            />
          </div>
          <div style={{ flexBasis: "50%", textAlign: "left", display: "flex" }}>
            <div
              style={{
                display: "inline-block",
                margin: "0 auto",
                minWidth: "233px"
              }}
            >
              <P>INTERNATIONAL?</P>
              <CheckboxesContainer>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={true}
                    checked={this.state.isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <Span>Yes</Span>
                </Label>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={false}
                    checked={!this.state.isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <Span>No</Span>
                </Label>
              </CheckboxesContainer>
              <div style={{ display: "flex" }}>
                <label>
                  <Checkbox
                    name="hasAcceptTerms"
                    checked={this.state.hasAcceptTerms}
                    onChange={this.handleCheckboxChange}
                  />
                </label>
                <Terms>
                  I have read and accepted <br />
                  <LinkToTerm to="/artist/profile">
                    terms and conditions
                  </LinkToTerm>
                </Terms>
              </div>
                <ButtonMd type="submit">Create Profile</ButtonMd>
            </div>
          </div>
        </Form>
      </SignUpContainer>
    );
  }
}

export default Signup;
