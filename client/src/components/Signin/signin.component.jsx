import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

import { setUserJWTToken } from "../../redux/user/user.action";

import { Form, FormInput } from "../FormInput/form-input.component";
import { ButtonMd } from "../Button/button.component";

import { SignUpContainer, H1, H2, H3, Img } from "./signin.styles.jsx";
import logo from "../../assets/logo.png";

class Signin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contactEmail: "",
      password: "",
    };
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const { setUserJWTToken } = this.props;
    const { contactEmail, password } = this.state;
    try {
      const {
        data: { token },
      } = await axios.post("/api/login-user", {
        username: contactEmail,
        password,
      });
      setUserJWTToken(token);
      this.setState({ contactEmail: "", password: "" });
    } catch (error) {
      console.log("Error Sign Up: ", error);
    }
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
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

        <Form onSubmit={this.handleSubmit}>
          <FormInput
            type="email"
            name="contactEmail"
            label="contact_email"
            placeholder="Contact Email"
            style={{ fontSize: "16px" }}
            handleChange={this.handleChange}
            value={this.state.contactEmail}
            required
          />
          <FormInput
            type="password"
            name="password"
            label="password"
            placeholder="Password"
            style={{ fontSize: "16px" }}
            handleChange={this.handleChange}
            value={this.state.password}
            required
          />
          <ButtonMd type="submit" style={{ width: "110px" }}>
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
});

export default connect(null, mapDispatchToProps)(Signin);
