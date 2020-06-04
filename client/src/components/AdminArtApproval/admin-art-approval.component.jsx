import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";
import { BtnArtSubmitLoading } from "../Button";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { IconButton } from "@material-ui/core";
import EmailTemplate from "./email-template.component";

import {
  TabArea,
  FilterHeader,
  AdjustableIconWrapper,
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
  FlipButtonsWrapper,
} from "./admin-art-approval.styles";

class AdminArtApproval extends Component {
  constructor(props) {
    super(props);

    this.artworkSubmissionForm = React.createRef();

    this.state = {
      artFile: "",
      artFileDownload: "",
      artistName: "",
      artistEmail: "",
      firstName: "",
      lastName: "",
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
    };
  }

  componentDidMount() {
    this._loadArtwork();
  }

  componentDidUpdate(prevProps) {
    if (this.props.id !== prevProps.id) {
      this._loadArtwork();
    }
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value, isDisableSubmit: false });
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };

  clickEnlargeImg = () => {
    this.setState({ isEnlargeImg: !this.state.isEnlargeImg });
  };

  _loadArtwork = async () => {
    try {
      const submissionDetailsAll = await this._getSubmittedArtwork();
      const {
        previewArt,
        artFile,
        ...submissionDetails
      } = submissionDetailsAll;
      this._loadPreviewArt(previewArt);
      // this._loadPSDFile(artFile);

      this.setState({
        ...submissionDetails,
        // artPreviewImg: previewArt,
        artFileDownload: artFile,
        artFile,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry Something went wrong, Please check back later.",
        showConfirmButton: false,
      });
    }
  };

  _loadPSDFile = async (artFile) => {
    try {
      const artFileDownload = await this._createBlob(artFile);
      this.setState({ artFileDownload });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry could not lot PSD file",
        showConfirmButton: false,
      });
    }
  };

  _loadPreviewArt = async (previewArt) => {
    try {
      const largeThumb = `/api/art-submissions-thumb/?src=${previewArt.substring(
        20
      )}&w=500`;
      const artPreviewImg = await this._createBlob(largeThumb);
      this.setState({ artPreviewImg });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry could not load art preview file",
        showConfirmButton: false,
      });
    }
  };

  _getSubmittedArtwork = async () => {
    const { token, id } = this.props;
    const {
      data: { submissionDetails },
    } = await axios.get(`/api/admin/submissions/review/${id}`, {
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

  onChange = async (event) => {
    const { value } = event.currentTarget;
    const { token } = this.props;
    const { id } = this.state;

    try {
      await axios.post(
        "/api/admin/submissions/status",
        { status: value, id },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      this.setState({ status: value });
      Swal.fire({
        icon: "success",
        title: "Status Changed to " + value,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Nothing Happened Sorry!",
      });
    }
  };

  render() {
    const {
      artFile,
      artFileDownload,
      artistName,
      artistEmail,
      firstName,
      lastName,
      createdAt,
      description,
      status,
      title,
      artPreviewImg,
      isEnlargeImg,
    } = this.state;

    const {
      closeAdminArtApproval,
      flipLeft,
      flipRight,
      isFlipLeftDisabled,
      isFlipRightDisabled,
    } = this.props;

    return (
      <>
        <TabArea>
          <FilterHeader>
            <AdjustableIconWrapper onClick={closeAdminArtApproval}>
              <HighlightOffIcon />
            </AdjustableIconWrapper>
          </FilterHeader>
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
                  onClick={this.clickEnlargeImg}
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
                style={{ width: "150px", height: "45px" }}
                loaded={artPreviewImg}
              >
                <DownloadLink href={artPreviewImg} download>
                  {artPreviewImg ? "Preview Image" : <LoadingIcon />}
                </DownloadLink>
              </BtnArtSubmitLoading>
              <BtnArtSubmitLoading
                type="button"
                textAlign="center"
                style={{ width: "95px", height: "45px" }}
              >
                {/* TODO: make below better */}
                <DownloadLink
                  href={`http://${window.location.host}${artFileDownload}`}
                  download
                >
                  {artFile ? "Art File" : <LoadingIcon />}
                </DownloadLink>
              </BtnArtSubmitLoading>
            </SubmitCard>
            <SubmitCard style={{ maxWidth: "355px" }}>
              <h4 style={{ color: "#fff" }}>Description box</h4>
              <div>
                <CaptionTitle>Artist:</CaptionTitle>
                <GreyTextArea>@{artistName}</GreyTextArea>
                <CaptionTitle>Name:</CaptionTitle>
                <GreyTextArea style={{ fontSize: "15px" }}>
                  {firstName} {lastName}
                </GreyTextArea>
                <CaptionTitle>Email:</CaptionTitle>
                <GreyTextArea style={{ fontSize: "15px" }}>
                  {artistEmail}
                </GreyTextArea>
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
                  <select onChange={this.onChange}>
                    <option value="NEW">NEW</option>
                    <option value="PENDING">PENDING</option>
                    <option value="REVIEWED">REVIEWED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="DECLINED">DECLINED</option>
                  </select>
                </div>
              </div>
            </SubmitCard>
          </ArtworkContainer>
          <FlipButtonsWrapper>
            <IconButton onClick={flipLeft} disabled={isFlipLeftDisabled}>
              <KeyboardArrowLeftIcon /> Previous
            </IconButton>
            <IconButton onClick={flipRight} disabled={isFlipRightDisabled}>
              Next <KeyboardArrowRightIcon />
            </IconButton>
          </FlipButtonsWrapper>
          <EmailTemplate title={title} artistEmail={artistEmail} />
        </TabArea>
      </>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtApproval);
