import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import axios from "axios";
import Swal from "sweetalert2";
import { isNameValid, isEmailValid, doesPasswordMatch } from "../../utils";

import {
  selectCurrentUser,
  selectUserJWTToken,
} from "../../redux/user/user.selector";
import { setUserAccount, setUserJWTToken } from "../../redux/user/user.action";

import { ButtonLgCenter, ButtonSm } from "../Button/button.component";
import {
  Checkbox,
  Label,
  CheckboxesContainer,
} from "../CheckBox/checkbox.component";
import { ReactComponent as EnvelopIcon } from "../../assets/envelope.svg";

import {
  ArtistProfileContainer,
  ProfileImg,
  ArtistName,
  FullName,
  FormTitle,
  ProfileForm,
  ProfileInfo,
  FormInputStyled,
  ErrorList,
  ErrorTitle,
} from "./artist-profile.styles";

class ArtistProfile extends Component {
  constructor(props) {
    super(props);

    this.artistProfileForm = React.createRef();

    this.state = {
      // Artist Profile
      artistName: "",
      firstName: "",
      lastName: "",
      paypalEmail: "",
      phoneNumber: "",
      socialFacebook: "",
      socialInstagram: "",
      socialTwitter: "",
      isInternational: "",
      // User Details
      newContactEmail: "",
      contactEmail: "",
      newPassword: "",
      confirmPassword: "",
      // Errors
      errorMessages: [],
      errorStatus: null,
      isArtistFormValid: true,
      isUserFormValid: true,
      // Boolean Modes
      isEditMode: false,
      hasArtistFromSaved: false,
      hasUserFormSaved: false,
    };
  }

  componentDidMount() {
    this._loadBasicArtistInfo();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      hasArtistFromSaved: false,
      hasUserFormSaved: false,
    });
  };

  handleToggleCheckBox = (event) => {
    const {
      name,
      dataset: { bool },
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    this.setState({ [name]: boolValue, hasArtistFromSaved: false });
  };

  handleSubmitArtistFrom = async (event) => {
    event.preventDefault();
    const artistForm = this._validateArtistForm();
    if (artistForm.isArtistFormValid) {
      const hasUpdatedSuccess = await this._updateArtistProfile();
      if (hasUpdatedSuccess) {
        Swal.fire({
          icon: "success",
          title: "Your profile has been updated!",
        });
        this.setState({ hasArtistFromSaved: true });
      }
    } else {
      this.handleScrollToElement(this.artistProfileForm.current.offsetTop);
      this.setState({ ...artistForm });
    }
  };

  handleSubmitUserForm = async (event) => {
    event.preventDefault();

    const userForm = this._validateUserForm();
    if (userForm.isUserFormValid) {
      const userProfile = await this._updateUserAccount();
      if (!!userProfile) {
        Swal.fire({
          icon: "success",
          title: "Your Account has been updated!",
        });
        this.setState({
          hasUserFormSaved: true,
          newContactEmail: "",
          newPassword: "",
          confirmPassword: "",
          ...userProfile,
        });
      }
    } else {
      this.setState({ ...userForm });
    }
  };

  handleClickOpenForm = async () => {
    const artistDetails = await this._getArtistProfile();
    this.setState({ ...artistDetails, isEditMode: true });
  };

  handleClickCloseForm = (event) => {
    event.preventDefault();
    this._loadBasicArtistInfo();
    this.setState({ isEditMode: false });
  };

  handleScrollToElement(scrollTo) {
    window.scrollTo(0, scrollTo);
  }

  _loadBasicArtistInfo = () => {
    const { basicArtistInfo } = this.props;
    this.setState({ ...basicArtistInfo });
  };

  _getArtistProfile = async () => {
    try {
      const { token } = this.props;
      const { data } = await axios.get("/api/artist-profile-details", {
        headers: { Authorization: `JWT ${token}` },
      });

      return data;
    } catch (error) {
      this._handleHttpErrors(error);
      return false;
    }
  };

  _updateArtistProfile = async () => {
    try {
      const { token, updateArtistInfo } = this.props;
      const {
        artistName,
        firstName,
        lastName,
        paypalEmail,
        phoneNumber,
        socialFacebook,
        socialInstagram,
        socialTwitter,
        isInternational,
      } = this.state;

      const reqBody = {
        artistName: artistName.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        paypalEmail: paypalEmail.trim(),
        phoneNumber: phoneNumber.trim(),
        socialFacebook: socialFacebook.trim(),
        socialInstagram: socialInstagram.trim(),
        socialTwitter: socialTwitter.trim(),
        isInternational,
      };

      const {
        data: { currentUser },
      } = await axios.put("/api/artist-profile-details", reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });

      updateArtistInfo({ ...currentUser });
      return true;
    } catch (error) {
      this._handleHttpErrors(error);
      return false;
    }
  };

  _updateUserAccount = async () => {
    const { token, setUserJWTToken, updateArtistInfo } = this.props;
    const { newContactEmail, newPassword } = this.state;

    const reqBody = {
      contactEmail: newContactEmail,
      password: newPassword,
    };

    try {
      const { data } = await axios.put("/api/update-user", reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });

      const { token: newToken, currentUser } = data;
      setUserJWTToken(newToken);
      updateArtistInfo({ ...currentUser });

      return currentUser;
    } catch (error) {
      this._handleHttpErrors(error);
      return false;
    }
  };

  _validateArtistForm = () => {
    const { firstName, lastName, paypalEmail } = this.state;
    const errorObj = {
      errorMessages: [],
      isArtistFormValid: true,
    };

    if (!isNameValid(firstName)) {
      errorObj.errorMessages.push("Please Enter A Valid First Name.");
      errorObj.isArtistFormValid = false;
    }

    if (!isNameValid(lastName)) {
      errorObj.errorMessages.push("Please Enter A Valid Last Name.");
      errorObj.isArtistFormValid = false;
    }

    if (!isEmailValid(paypalEmail)) {
      errorObj.errorMessages.push("Please Enter A Valid Email For Paypal.");
      errorObj.isArtistFormValid = false;
    }
    return errorObj;
  };

  _validateUserForm = () => {
    const { contactEmail, newPassword, confirmPassword } = this.state;
    const errorObj = {
      errorMessages: [],
      isUserFormValid: true,
    };

    if (!doesPasswordMatch(newPassword, confirmPassword)) {
      errorObj.errorMessages.push("Passwords Must Match.");
      errorObj.isUserFormValid = false;
    }

    if (!isEmailValid(contactEmail)) {
      errorObj.errorMessages.push("Please Enter A Valid Email.");
      errorObj.isUserFormValid = false;
    }

    return errorObj;
  };

  _handleHttpErrors = (error) => {
    const { status, data } = error.response;
    const { message } = data;
    if (status === 304) {
      Swal.fire({
        icon: "error",
        text: "No fields were changed",
      });
    } else {
      // TODO: Handle Errors better
      this.setState({
        errorMessages: [message],
        errorStatus: status,
      });
    }
  };

  render() {
    const {
      // Artist Profile
      artistName,
      firstName,
      lastName,
      paypalEmail,
      phoneNumber,
      socialFacebook,
      socialInstagram,
      socialTwitter,
      isInternational,
      // User Details
      newContactEmail,
      contactEmail,
      newPassword,
      confirmPassword,
      // Errors
      errorMessages,
      isArtistFormValid,
      isUserFormValid,
      // Boolean Modes
      isEditMode,
      hasArtistFromSaved,
      hasUserFormSaved,
    } = this.state;

    return (
      <ArtistProfileContainer>
        <ProfileImg
          style={{ backgroundImage: "url(http://placekitten.com/g/300/300)" }}
        />
        {isEditMode ? (
          <>
            <ProfileForm ref={this.artistProfileForm}>
              {!isArtistFormValid && errorMessages.length > 0 ? (
                <ErrorList>
                  <ErrorTitle>Please Correct Error(s)</ErrorTitle>
                  {errorMessages.map((errMsg, i) => (
                    <li key={i}>{errMsg}</li>
                  ))}
                </ErrorList>
              ) : (
                <FormTitle>Artist Profile</FormTitle>
              )}
              <FormInputStyled
                type="text"
                name="artistName"
                label="Artist Name"
                isShowLabel={true}
                value={artistName}
                readOnly
                style={{ cursor: "not-allowed" }}
              />
              <FormInputStyled
                type="text"
                name="firstName"
                label="First Name"
                isShowLabel={true}
                placeholder="First Name"
                handleChange={this.handleChange}
                value={firstName}
                required
              />
              <FormInputStyled
                type="text"
                name="lastName"
                label="Last Name"
                isShowLabel={true}
                placeholder="Last Name"
                handleChange={this.handleChange}
                value={lastName}
                required
              />
              <FormInputStyled
                type="email"
                name="paypalEmail"
                isShowLabel={true}
                label="Paypal Email"
                placeholder="Paypal Email"
                handleChange={this.handleChange}
                value={paypalEmail}
                required
              />
              <FormInputStyled
                type="text"
                name="phoneNumber"
                label="Phone Number"
                isShowLabel={true}
                placeholder="Phone Number"
                handleChange={this.handleChange}
                value={phoneNumber}
                required
              />
              <FormInputStyled
                type="text"
                name="socialFacebook"
                label="Facebook"
                isShowLabel={true}
                placeholder="Facebook Handle"
                handleChange={this.handleChange}
                value={socialFacebook}
              />
              <FormInputStyled
                type="text"
                name="socialInstagram"
                label="Instagram"
                isShowLabel={true}
                placeholder="Instagram Handle"
                handleChange={this.handleChange}
                value={socialInstagram}
              />
              <FormInputStyled
                type="text"
                name="socialTwitter"
                label="Twitter"
                isShowLabel={true}
                placeholder="Twitter Handle"
                handleChange={this.handleChange}
                value={socialTwitter}
              />
              <p>INTERNATIONAL?</p>
              <CheckboxesContainer>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={true}
                    checked={isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <span>Yes</span>
                </Label>
                <Label>
                  <Checkbox
                    name="isInternational"
                    data-bool={false}
                    checked={!isInternational}
                    onChange={this.handleToggleCheckBox}
                  />
                  <span>No</span>
                </Label>
              </CheckboxesContainer>
              {hasArtistFromSaved ? (
                <>
                  <ButtonSm disabled={true}>Saved!</ButtonSm>{" "}
                  <ButtonSm onClick={this.handleClickCloseForm}>X</ButtonSm>
                </>
              ) : (
                <>
                  <ButtonSm onClick={this.handleSubmitArtistFrom}>
                    Save Artist Profile
                  </ButtonSm>{" "}
                  <ButtonSm onClick={this.handleClickCloseForm}>X</ButtonSm>
                </>
              )}
            </ProfileForm>
            <ProfileForm>
              {!isUserFormValid && errorMessages.length > 0 ? (
                <ErrorList>
                  <ErrorTitle>Please Correct Error(s)</ErrorTitle>
                  {errorMessages.map((errMsg, i) => (
                    <li key={i}>{errMsg}</li>
                  ))}
                </ErrorList>
              ) : (
                <FormTitle>Account Information</FormTitle>
              )}
              <FormInputStyled
                type="text"
                name="newContactEmail"
                label="Contact Email"
                isShowLabel={true}
                handleChange={this.handleChange}
                value={newContactEmail}
                placeholder={contactEmail}
                required
              />
              <FormInputStyled
                type="password"
                name="newPassword"
                label="New Password"
                isShowLabel={true}
                handleChange={this.handleChange}
                value={newPassword}
              />
              <FormInputStyled
                type="password"
                name="confirmPassword"
                label="Confirm Password"
                isShowLabel={true}
                handleChange={this.handleChange}
                value={confirmPassword}
              />
              {hasUserFormSaved ? (
                <>
                  <ButtonSm disabled={true}>Saved!</ButtonSm>{" "}
                  <ButtonSm onClick={this.handleClickCloseForm}>X</ButtonSm>
                </>
              ) : (
                <>
                  <ButtonSm onClick={this.handleSubmitUserForm}>
                    Save User Details
                  </ButtonSm>{" "}
                  <ButtonSm onClick={this.handleClickCloseForm}>X</ButtonSm>
                </>
              )}
            </ProfileForm>
          </>
        ) : (
          <>
            <ArtistName>@{artistName}</ArtistName>
            <FullName>{`${firstName} ${lastName}`}</FullName>

            <ProfileInfo>
              <EnvelopIcon />
              {contactEmail}
            </ProfileInfo>
            <ButtonLgCenter onClick={this.handleClickOpenForm}>
              EDIT PROFILE
            </ButtonLgCenter>
          </>
        )}
      </ArtistProfileContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  basicArtistInfo: selectCurrentUser,
  token: selectUserJWTToken,
});

const mapDispatchToProps = (dispatch) => ({
  updateArtistInfo: (basicInfo) => dispatch(setUserAccount(basicInfo)),
  setUserJWTToken: (token) => dispatch(setUserJWTToken(token)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtistProfile);
