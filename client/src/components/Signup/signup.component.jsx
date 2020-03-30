import React, { Component } from "react";

import FormInput from "../FormInput/form-input.component";
import Checkbox from "../CheckBox/checkbox.component";

import {
  SignUpContainer,
  H1,
  H2,
  H3,
  P,
  Span,
  Img,
  Terms,
  LinkToTerm
} from "./signup.styles.jsx";
import logo from "../../assets/logo.png";

class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      checked: false
    };
  }

  handleSubmit = async event => {
    event.preventDefault();

    const { email, password } = this.state;

    try {
      console.log("Email: ", email);
      console.log("password: ", password);
      this.setState({ email: "", password: "" });
    } catch (error) {
      console.log("Sign In -> handle Submit", error);
    }
  };

  handleChange = event => {
    const { name, value } = event.target;

    this.setState({ [name]: value }, () => console.log(this.state));
  };

  handleCheckboxChange = event => {
    const { checked } = event.target;
    this.setState({ checked });
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

        <form
          onSubmit={this.handleSubmit}
          style={{ display: "flex", marginTop: "84px" }}
        >
          <div style={{ flexBasis: "50%" }}>
            <FormInput
              type="text"
              name="artist-name"
              label="Artist Name"
              isLabelHidden={true}
              placeholder="@Artist Name"
              style={{ fontSize: "21px" }}
              handleChange={this.handleChange}
              value={this.state.email}
              required
            />
            <FormInput
              type="text"
              name="first_name"
              label="First Name"
              isLabelHidden={true}
              placeholder="First Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.password}
              required
            />
            <FormInput
              type="text"
              name="last_name"
              label="Last Name"
              isLabelHidden={true}
              placeholder="Last Name"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.password}
              required
            />
            <FormInput
              type="email"
              name="contact_email"
              isLabelHidden={true}
              label="contact_email"
              placeholder="Contact Email"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.password}
              required
            />
            <FormInput
              type="email"
              name="paypal_email"
              isLabelHidden={true}
              label="Paypal Email"
              placeholder="Paypal Email"
              style={{ fontSize: "15px" }}
              handleChange={this.handleChange}
              value={this.state.password}
              required
            />
          </div>
          <div style={{ flexBasis: "50%", textAlign: "left", display: "flex" }}>
            <div style={{ display: "inline-block", margin: "0 auto" }}>
              <P>INTERNATIONAL?</P>
              <div style={{ marginBottom: "30px", display: "flex" }}>
                <label style={{ flexBasis: "50%" }}>
                  <Checkbox
                    checked={this.state.checked}
                    onChange={this.handleCheckboxChange}
                  />
                  <Span>Yes</Span>
                </label>
                <label style={{ flexBasis: "50%" }}>
                  <Checkbox
                    checked={this.state.checked}
                    onChange={this.handleCheckboxChange}
                  />
                  <Span>No</Span>
                </label>
              </div>
              <div style={{ display: "flex" }}>
                <label>
                  <Checkbox
                    checked={this.state.checked}
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
            </div>
          </div>
        </form>
      </SignUpContainer>
    );
  }
}

export default Signup;
