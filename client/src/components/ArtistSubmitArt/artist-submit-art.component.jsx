import React, { Component } from "react";

import { ReactComponent as Upload } from "../../assets/upload.svg";
import { Checkbox } from "../CheckBox";
import { BtnArtSubmit } from "../Button";

import {
  SubmissionContainer,
  TabHeader,
  TabTitle,
  TabSubTitle,
  TabSubLink,
  TabArea,
  SubTitle,
  SubmitCartContainer,
  SubmitCard,
  ArtPreview,
  IconContainer,
  IconTopSubtitle,
  IconBottomSubtitle,
  FormStyled,
  FormInputArtistStyled,
  FormInputTitleStyled,
  TextAreaStyled,
  TermsWrapper,
  Terms,
  LinkToTerm,
} from "./artist-submit-art.styles";

class ArtistSubmitArt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artistName: "BeastWreck",
      title: "",
      description: "",
      hasAcceptTerms: false,
      isDisableSubmit: false,
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  render() {
    const {
      artistName,
      title,
      description,
      hasAcceptTerms,
      isDisableSubmit,
    } = this.state;

    return (
      <SubmissionContainer>
        <TabHeader>
          <TabTitle>Submit Artwork</TabTitle>
          <TabSubTitle>
            <TabSubLink to={`/artist/submissions/all`}>Submissions</TabSubLink>
          </TabSubTitle>
        </TabHeader>
        <TabArea>
          <SubTitle>Create New Submission</SubTitle>
          <SubmitCartContainer>
            <SubmitCard>
              <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
              <ArtPreview>
                <IconContainer>
                  <Upload />
                </IconContainer>
                <IconTopSubtitle>
                  Drag and drop or click to upload images
                </IconTopSubtitle>
                <IconBottomSubtitle style={{ position: "absolute" }}>
                  Recommendation .png or .jpg
                </IconBottomSubtitle>
              </ArtPreview>
              <BtnArtSubmit
                type="submit"
                disabled={isDisableSubmit}
                textAlign="center"
              >
                UPLOAD ART FILE
              </BtnArtSubmit>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IconTopSubtitle>ai, psd, or eps at 300 dpi</IconTopSubtitle>
              </div>
            </SubmitCard>
            <SubmitCard>
              <h4 style={{ color: "#fff" }}>Description box </h4>
              <FormStyled>
                <FormInputArtistStyled
                  type="text"
                  name="artistName"
                  label="artist_name"
                  data-lpignore="true"
                  value={`@${artistName}`}
                />
                <FormInputTitleStyled
                  type="text"
                  name="title"
                  label="title"
                  placeholder="TITLE"
                  data-lpignore="true"
                  autoComplete="off"
                  handleChange={this.handleChange}
                  value={title}
                  required
                />
                <TextAreaStyled
                  type="text"
                  name="description"
                  label="Description"
                  placeholder="DESCRIPTION"
                  data-lpignore="true"
                  autoComplete="off"
                  handleChange={this.handleChange}
                  value={description}
                  required
                />
                <TermsWrapper>
                  <label>
                    <Checkbox
                      name="hasAcceptTerms"
                      checked={hasAcceptTerms}
                      onChange={this.handleCheckboxChange}
                      required
                    />
                  </label>
                  <Terms>
                    I have read and accepted{" "}
                    <LinkToTerm to="/artist/profile">
                      terms and conditions
                    </LinkToTerm>
                  </Terms>
                </TermsWrapper>
                <BtnArtSubmit
                  type="submit"
                  disabled={isDisableSubmit}
                  textAlign="right"
                  style={{ backgroundColor: "#0B7C80" }}
                >
                  SUBMIT
                </BtnArtSubmit>
              </FormStyled>
            </SubmitCard>
          </SubmitCartContainer>
        </TabArea>
      </SubmissionContainer>
    );
  }
}

export default ArtistSubmitArt;
