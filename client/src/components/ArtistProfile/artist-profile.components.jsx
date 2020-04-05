import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import axios from "axios";

import {
  selectCurrentUser,
  selectUserJWTToken,
} from "../../redux/user/user.selector";

import { ButtonLgCenter, ButtonLg } from "../Button/button.component";
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
  ProfileForm,
  ProfileInfo,
  FormInputStyled,
} from "./artist-profile.styles";

class ArtistProfile extends Component {
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
      isInternational: "",
      isEditMode: false,
    };
  }

  componentDidMount() {
    this._loadBasicArtistInfo();
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    await this._updateProfile();
    this.setState({ isEditMode: false });
  };

  handleSubmitResetFields = (event) => {
    event.preventDefault();
    this._loadBasicArtistInfo();
    this.setState({ isEditMode: false });
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClick = async () => {
    const artistDetails = await this._fetchProfile();
    this.setState({ isEditMode: !this.state.isEditMode, ...artistDetails });
  };

  handleToggleCheckBox = (event) => {
    const {
      name,
      dataset: { bool },
    } = event.target;
    const boolValue = bool.toLowerCase() === "true" ? true : false;
    this.setState({ [name]: boolValue });
  };

  _loadBasicArtistInfo = () => {
    const { basicArtistInfo } = this.props;
    this.setState({ ...basicArtistInfo });
  };

  _fetchProfile = async () => {
    try {
      const { token } = this.props;
      const { data } = await axios.get("/api/artist-profile-details", {
        headers: { Authorization: `JWT ${token}` },
      });

      return data;
    } catch (error) {
      console.log("_fetchProfileDetails", error);
    }
  };

  _updateProfile = async () => {
    try {
      const { token } = this.props;
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
      } = this.state;

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
      };

      const response = await axios.put("/api/artist-profile-details", reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });

      return response;
    } catch (error) {
      console.log("_updateProfile", error);
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
      isEditMode,
    } = this.state;
    return (
      <ArtistProfileContainer>
        <ProfileImg
          style={{ backgroundImage: "url(http://placekitten.com/g/300/300)" }}
        />
        {isEditMode ? (
          <ProfileForm>
            <FormInputStyled
              type="text"
              name="artistName"
              label="Artist Name"
              isShowLabel={true}
              handleChange={this.handleChange}
              value={artistName}
              required
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
              type="text"
              name="artistName"
              label="Contact Email"
              isShowLabel={true}
              handleChange={this.handleChange}
              value={contactEmail}
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
            <ButtonLg onClick={this.handleSubmit}>Save</ButtonLg>{" "}
            <ButtonLg onClick={this.handleSubmitResetFields}>Close</ButtonLg>
          </ProfileForm>
        ) : (
          <>
            <ArtistName>@{artistName}</ArtistName>
            <FullName>{`${firstName} ${lastName}`}</FullName>

            <ProfileInfo>
              <EnvelopIcon />
              {contactEmail}
            </ProfileInfo>
            <ButtonLgCenter onClick={this.handleClick}>
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

export default connect(mapStateToProps)(ArtistProfile);
