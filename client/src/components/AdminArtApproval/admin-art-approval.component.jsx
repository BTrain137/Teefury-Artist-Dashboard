import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";
import { ButtonSm, BtnArtSubmitLoading } from "../Button";
import EmailTemplate from "./email-template.component";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton, MenuItem, Select } from "@material-ui/core";

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
  FormInputTitleStyled,
  TextAreaStyled,
  GreyTextArea,
  CaptionTitle,
  DownloadLink,
  CenterButtonsWrapper,
} from "./admin-art-approval.styles";

const buttonAndTextFontStyle = {
  fontFamily:
    "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "15px",
  fontWeight: "bold",
};

const AdminArtApproval = (props) => {
  const {
    id,
    token,
    closeAdminArtApproval,
    flipLeft,
    flipRight,
    isFlipLeftDisabled,
    isFlipRightDisabled,
  } = props;

  const [state, setState] = useState({
    artFile: "",
    artFileDownload: "",
    artistName: "",
    artistEmail: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    description: "",
    previewArt: "",
    isEnlargeImg: false,
    status: "",
    title: "",
    artHasSubmitted: false,
    isDisableSubmit: false,
  });

  const [artPreviewImg, setArtPreviewImg] = useState("");

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
    isEnlargeImg,
  } = state;

  useEffect(() => {
    _loadArtwork();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value, isDisableSubmit: false });
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "/api/admin/submissions",
        { title, description, status, id },
        {
          headers: { Authorization: `JWT ${token}` },
        }
      );
      setState({
        ...state,
        title,
        description,
        status,
      });
      Swal.fire({
        icon: "success",
        title: "Successfully saved your changes!",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }
  };

  const clickEnlargeImg = () => {
    setState({ ...state, isEnlargeImg: !isEnlargeImg });
  };

  const _loadArtwork = async () => {
    try {
      const submissionDetailsAll = await _getSubmittedArtwork();
      const {
        previewArt,
        artFile,
        ...submissionDetails
      } = submissionDetailsAll;
      _loadPreviewArt(previewArt);
      // _loadPSDFile(artFile);

      setState({
        ...state,
        ...submissionDetails,
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

  // eslint-disable-next-line
  const _loadPSDFile = async (artFile) => {
    try {
      const artFileDownload = await _createBlob(artFile);
      setState({ ...state, artFileDownload });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry could not load PSD file",
        showConfirmButton: false,
      });
    }
  };

  const _loadPreviewArt = async (previewArt) => {
    try {
      const largeThumb = `/api/art-submissions-thumb/?src=${previewArt.substring(
        20
      )}&w=500`;
      const artPreviewImg = await _createBlob(largeThumb);
      setArtPreviewImg(artPreviewImg);
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry could not load art preview file",
        showConfirmButton: false,
      });
    }
  };

  const _getSubmittedArtwork = async () => {
    const {
      data: { submissionDetails },
    } = await axios.get(`/api/admin/submissions/review/${id}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });

    return submissionDetails;
  };

  const _createBlob = async (previewArt) => {
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

  return (
    <>
      <TabArea>
        <FilterHeader>
          <AdjustableIconWrapper onClick={closeAdminArtApproval}>
            <HighlightOffIcon />
          </AdjustableIconWrapper>
        </FilterHeader>
        <ArtworkContainer>
          <SubmitCard>
            <h4 style={{ color: "#6A6A6A" }}>Preview Image</h4>
            {artPreviewImg ? (
              <PreviewImage
                src={artPreviewImg}
                alt="Art Preview"
                isEnlargeImg={isEnlargeImg}
                onClick={clickEnlargeImg}
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
              <FormInputTitleStyled
                type="text"
                name="title"
                label="title"
                placeholder="TITLE"
                data-lpignore="true"
                autoComplete="off"
                handleChange={handleChange}
                value={title}
                maxlength="180"
                required
              />
              <CaptionTitle>Description:</CaptionTitle>
              <TextAreaStyled
                type="text"
                name="description"
                label="Description"
                placeholder="DESCRIPTION"
                data-lpignore="true"
                autoComplete="off"
                handleChange={handleChange}
                value={description}
                maxlength="255"
                required
              />
              <CaptionTitle>Submitted:</CaptionTitle>
              <GreyTextArea style={{ fontSize: "15px" }}>
                {new Date(createdAt).toLocaleString("en-US", {
                  timeZone: "GMT",
                })}
              </GreyTextArea>
              <CaptionTitle>Status:</CaptionTitle>
              <GreyTextArea>
                <Select
                  labelId="statusSelect"
                  id="statusSelect"
                  name="status"
                  value={status}
                  onChange={handleChange}
                  disableUnderline
                  style={{
                    ...buttonAndTextFontStyle,
                    width: "100%",
                  }}
                >
                  <MenuItem value={"NEW"} style={buttonAndTextFontStyle}>
                    NEW
                  </MenuItem>
                  <MenuItem value={"PENDING"} style={buttonAndTextFontStyle}>
                    PENDING
                  </MenuItem>
                  <MenuItem value={"REVIEWED"} style={buttonAndTextFontStyle}>
                    REVIEWED
                  </MenuItem>
                  <MenuItem value={"APPROVED"} style={buttonAndTextFontStyle}>
                    APPROVED
                  </MenuItem>
                  <MenuItem value={"DECLINED"} style={buttonAndTextFontStyle}>
                    DECLINED
                  </MenuItem>
                  <MenuItem value={"PUBLISHED"} style={buttonAndTextFontStyle}>
                    PUBLISHED
                  </MenuItem>
                </Select>
              </GreyTextArea>
            </div>
            <CenterButtonsWrapper>
              <ButtonSm
                onClick={handleSave}
                style={{
                  ...buttonAndTextFontStyle,
                  color: "#ffffff",
                  borderRadius: "20px",
                  padding: "13px 22px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Save <SaveIcon style={{ marginLeft: "5px" }} />
              </ButtonSm>
            </CenterButtonsWrapper>
          </SubmitCard>
        </ArtworkContainer>
        <CenterButtonsWrapper>
          <IconButton onClick={flipLeft} disabled={isFlipLeftDisabled}>
            <KeyboardArrowLeftIcon /> Previous
          </IconButton>
          <IconButton onClick={flipRight} disabled={isFlipRightDisabled}>
            Next <KeyboardArrowRightIcon />
          </IconButton>
        </CenterButtonsWrapper>
        <EmailTemplate title={title} artistEmail={artistEmail} />
      </TabArea>
    </>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtApproval);
