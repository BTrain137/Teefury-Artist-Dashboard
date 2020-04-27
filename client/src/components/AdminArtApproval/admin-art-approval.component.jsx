import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";
import { BtnArtSubmit, BtnArtSubmitLoading } from "../Button";
import ApprovedEmail from "./approved-email.component";

import {
  SubmissionContainer,
  TabArea,
  ArtworkContainer,
  PreviewImage,
  ArtPreview,
  IconContainer,
  IconBottomSubtitle,
  IconTopSubtitle,
  SubmitCard,
  GreyTextArea,
  CaptionTitle,
  DownloadLink,
} from "./admin-art-approval.styles";

class ArtistSubmitArt extends Component {
  constructor(props) {
    super(props);

    this.artworkSubmissionForm = React.createRef();

    this.state = {
      artFile: "",
      artFileDownload: "",
      artistName: "",
      artistEmail: "",
      createdAt: "",
      description: "",
      id: null,
      previewArt: "",
      artPreviewImg: "",
      isEnlargeImg: false,
      status: "",
      title: "",
      artHasSubmitted: false,
      isDisableSubmit: false,
      isApproved: false,
      isDenied: false,
    };
  }

  componentDidMount() {
    this._loadArtwork();
  }

  componentDidUpdate() {}

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, isDisableSubmit: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };

  handleClick = (event) => {
    this.setState({ isEnlargeImg: !this.state.isEnlargeImg });
  };

  _loadArtwork = async () => {
    try {
      const submissionDetails = await this._getSubmittedArtwork();
      const { previewArt, artFile } = submissionDetails;
      const artPreviewImg = await this._createBlob(previewArt);
      const artFileDownload = await this._createBlob(artFile);

      this.setState({ ...submissionDetails, artPreviewImg, artFileDownload });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry Something went wrong, Please check back later.",
        showConfirmButton: false,
      });
    }
  };

  _getSubmittedArtwork = async () => {
    const {
      token,
      match: { params },
    } = this.props;
    const {
      data: { submissionDetails },
    } = await axios.get(`/api/admin/submissions/review/${params.id}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    return submissionDetails;
  };

  _createBlob = async (previewArt) => {
    const { token } = this.props;
    return await fetch(previewArt, {
      headers: { Authorization: `JWT ${token}` },
    })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        return URL.createObjectURL(blob);
      });
  };

  handleClickApproved = () => {
    this.setState({
      isApproved: true,
    });
  };

  handleClickDeny = () => {
    this.setState({
      isDenied: true,
    });
  };

  render() {
    const {
      artFile,
      artFileDownload,
      artistName,
      artistEmail,
      createdAt,
      description,
      id,
      // previewArt,
      status,
      title,
      // artHasSubmitted,
      // isDisableSubmit,
      artPreviewImg,
      isEnlargeImg,
      isApproved,
    } = this.state;

    return (
      <SubmissionContainer>
        <TabArea>
          <ArtworkContainer
            onSubmit={this.handleSubmit}
            ref={this.artworkSubmissionForm}
          >
            <SubmitCard>
              <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
              {artPreviewImg ? (
                <PreviewImage
                  src={this.state.artPreviewImg}
                  alt="Art Preview"
                  isEnlargeImg={isEnlargeImg}
                  onClick={this.handleClick}
                />
              ) : (
                <ArtPreview>
                  <IconContainer>
                    <UploadIcon />
                  </IconContainer>
                  <IconBottomSubtitle style={{ position: "absolute" }}>
                    No Art Was Submitted
                  </IconBottomSubtitle>
                </ArtPreview>
              )}
              <div style={{ display: "flex", justifyContent: "center" }}>
                <IconTopSubtitle>Downloads</IconTopSubtitle>
              </div>
              <BtnArtSubmitLoading
                type="button"
                textAlign="center"
                style={{ width: "95px", height: "45px" }}
              >
                <DownloadLink href={artFileDownload} download>
                  {artFile ? "Art File" : <LoadingIcon />}
                </DownloadLink>
              </BtnArtSubmitLoading>
            </SubmitCard>
            <SubmitCard>
              <h4 style={{ color: "#fff" }}>Description box</h4>
              <div>
                <CaptionTitle>Artist:</CaptionTitle>
                <GreyTextArea>@{artistName}</GreyTextArea>
                <CaptionTitle>Title:</CaptionTitle>
                <GreyTextArea>{title}</GreyTextArea>
                <CaptionTitle>Description:</CaptionTitle>
                <GreyTextArea style={{ fontSize: "15px" }}>
                  {description}
                </GreyTextArea>
                <CaptionTitle>Submitted:</CaptionTitle>
                <GreyTextArea style={{ fontSize: "15px" }}>
                  {new Date(createdAt).toLocaleString("en-US")}
                </GreyTextArea>
                <CaptionTitle>Status:</CaptionTitle>
                <GreyTextArea style={{ fontSize: "15px" }}>
                  {status}
                </GreyTextArea>
                <div
                  style={{ display: "flex", justifyContent: "space-around" }}
                >
                  <BtnArtSubmit
                    type="submit"
                    textAlign="right"
                    style={{ backgroundColor: "rgb(0, 182, 6)" }}
                    onClick={this.handleClickApproved}
                  >
                    Approve
                  </BtnArtSubmit>
                  <BtnArtSubmit
                    type="submit"
                    textAlign="right"
                    style={{ backgroundColor: "rgb(236, 0, 0)" }}
                    onClick={this.handleClickDeny}
                  >
                    Deny
                  </BtnArtSubmit>
                </div>
              </div>
            </SubmitCard>
          </ArtworkContainer>
          {isApproved ? (
            <ApprovedEmail title={title} id={id} artistEmail={artistEmail} />
          ) : null}
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default withRouter(connect(mapStateToProps)(ArtistSubmitArt));
