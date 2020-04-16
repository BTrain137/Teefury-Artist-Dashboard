import React, { Component } from "react";
import axios from "axios";
import { cleanFileName } from "../../utils";

import { ReactComponent as Upload } from "../../assets/upload.svg";
import { InputArtFile, BtnArtSubmit, InputArtPreview } from "../Button";

import {
  SubmissionContainer,
  TabHeader,
  TabTitle,
  TabSubTitle,
  TabSubLink,
  TabArea,
  SubTitle,
  FormArtistSubmit,
  SubmitCard,
  ArtPreview,
  IconContainer,
  IconTopSubtitle,
  IconBottomSubtitle,
  PreviewImage,
  FormInputArtistStyled,
  FormInputTitleStyled,
  TextAreaStyled,
} from "./artist-submit-art.styles";

class ArtistSubmitArt extends Component {
  constructor(props) {
    super(props);

    this.state = {
      artistName: "BeastWreck",
      title: "",
      description: "",
      isDisableSubmit: false,
      artFileName: "ART FILE",
    };
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const allItems = Array.from(event.target.elements);

    const formData = new FormData();

    allItems.forEach((el) => {
      if (el.files) {
        formData.append(el.name, el.files[0]);
      } else if (el.value) {
        formData.append(el.name, el.value);
      }
    });

    for (let key of formData.keys()) {
      console.log(key);
      console.log(formData.get(key));
    }

    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    axios.post("/api/artist/submit-artwork", formData, config).then((resp) => {
      console.log(resp.data);
    });
  };

  onChangeArtPreview = async (event) => {
    const [file] = event.target.files;

    if (!file) return;
    // Make sure `file.name` matches our extensions criteria
    if (!/\.(jpe?g|png)$/i.test(file.name)) return;

    const artPreviewImg = await this.generatePreviewImg(file);
    this.setState({ artPreviewImg });
  };

  onChangeArtPSD = (event) => {
    let [file] = event.target.files;
    if (!file) return;

    const { name } = file;
    this.setState({ artFileName: cleanFileName(name) });
  };

  handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked });
  };

  generatePreviewImg = (file) => {
    return new Promise((resolve, reject) => {
      const loadImg = () => {
        reader.removeEventListener("load", loadImg);
        reader.removeEventListener("error", loadError);
        resolve(reader.result);
      };

      const loadError = (event) => {
        reader.removeEventListener("load", loadImg);
        reader.removeEventListener("error", loadError);
        reject(event);
      };

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.addEventListener("load", loadImg);
      reader.addEventListener("error", loadError);
    });
  };

  render() {
    const {
      artistName,
      title,
      description,
      isDisableSubmit,
      artPreviewImg,
      artFileName,
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
          <FormArtistSubmit onSubmit={this.handleSubmit}>
            <SubmitCard>
              <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
              <label htmlFor="preview-art">
                <InputArtPreview
                  id="preview-art"
                  type="file"
                  name="previewArt"
                  onChange={this.onChangeArtPreview}
                  textAlign="center"
                  required
                >
                  {artPreviewImg ? (
                    <PreviewImage
                      src={this.state.artPreviewImg}
                      alt="Art Preview"
                    />
                  ) : (
                    <ArtPreview>
                      <IconContainer>
                        <Upload />
                      </IconContainer>
                      <IconTopSubtitle>Click to upload images</IconTopSubtitle>
                      <IconBottomSubtitle style={{ position: "absolute" }}>
                        Recommendation .png or .jpg
                      </IconBottomSubtitle>
                    </ArtPreview>
                  )}
                </InputArtPreview>
              </label>
              <label htmlFor="art-file">
                <InputArtFile
                  id="art-file"
                  type="file"
                  name="artFile"
                  onChange={this.onChangeArtPSD}
                  textAlign="center"
                  required
                >
                  {artFileName}
                </InputArtFile>
              </label>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IconTopSubtitle>ai, psd, or eps at 300 dpi</IconTopSubtitle>
              </div>
            </SubmitCard>
            <SubmitCard>
              <h4 style={{ color: "#fff" }}>Description box </h4>
              <div>
                <FormInputArtistStyled
                  type="text"
                  name="artistName"
                  label="artist_name"
                  data-lpignore="true"
                  value={`@${artistName}`}
                  readOnly
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
                <BtnArtSubmit
                  type="submit"
                  disabled={isDisableSubmit}
                  textAlign="right"
                  style={{ backgroundColor: "#0B7C80", cursor: "pointer" }}
                >
                  SUBMIT
                </BtnArtSubmit>
              </div>
            </SubmitCard>
          </FormArtistSubmit>
        </TabArea>
      </SubmissionContainer>
    );
  }
}

export default ArtistSubmitArt;
