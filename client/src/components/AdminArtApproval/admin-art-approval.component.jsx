import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { ReactComponent as UploadIcon } from "../../assets/upload.svg";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";
import { MainButton } from "../Button";
import EmailTemplate from "./email-template.component";

import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import DeleteIcon from "@material-ui/icons/Delete";
import DoneIcon from "@material-ui/icons/Done";
import SaveIcon from "@material-ui/icons/Save";
import { IconButton, MenuItem, Select } from "@material-ui/core";

import {
  TabArea,
  FilterHeader,
  AdjustableIconWrapper,
  ArtworkContainer,
  PreviewImage,
  ArtPreview,
  ArtFileButtonsWrapper,
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

const cntrTxtBtnsWithIcons = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const deleteArtFileBtnStyle = {
  fontSize: "10px",
  fontWeight: "normal",
  backgroundColor: "transparent",
  border: "1px solid #c23b22",
  color: "#c23b22",
  width: "150px",
  marginLeft: "5px",
};

const nextPreviousBtnStyle = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
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
    previewArt: "",
    artFile: "",
    artFileDownload: "",
    isEnlargeImg: false,
    artistName: "",
    artistEmail: "",
    firstName: "",
    lastName: "",
    createdAt: "",
    description: "",
    status: "",
    title: "",
    artHasSubmitted: false,
    isDisableSubmit: false,
  });
  const [isArtFileDeleted, setIsArtFileDeleted] = useState(false);
  const [artPreviewImg, setArtPreviewImg] = useState("");

  const {
    artFile,
    artFileDownload,
    isEnlargeImg,
    artistName,
    artistEmail,
    firstName,
    lastName,
    createdAt,
    description,
    status,
    title,
  } = state;

  useEffect(() => {
    _loadArtwork();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (value === "DECLINED") {
      Swal.fire({
        text: "If you decline this art, the art file will be deleted.",
        icon: "warning",
      });
    }

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

      if (status === "DECLINED") {
        _deleteDeclinedArtFileById();
      }

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
      // _loadArtFile(artFile);

      if (artFile === "" || artFile === null) {
        setIsArtFileDeleted(true);
      }

      setState({
        ...state,
        ...submissionDetails,
        artFileDownload: artFile,
        artFile,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: "Sorry something went wrong, Please check back later.",
        showConfirmButton: false,
      });
    }
  };

  // eslint-disable-next-line
  const _loadArtFile = async (artFile) => {
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

  const _deleteDeclinedArtFileById = () => {
    axios.delete(`/api/admin/submissions/declined-art-file/${id}`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    setIsArtFileDeleted(true);
  };

  const _handleDeleteArtFileClick = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "The art file will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonColor: "#d33",
    }).then((response) => {
      if (response.value) {
        Swal.fire({
          title: "Poof! The art file has been deleted!",
          icon: "success",
        });
        axios.delete(`/api/admin/submissions/declined-art-file/${id}`, {
          headers: {
            Authorization: `JWT ${token}`,
          },
        });
        setIsArtFileDeleted(true);
      } else {
        Swal.fire("The art file was not deleted.");
      }
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
            <MainButton
              type="button"
              style={{ width: "250px" }}
              loaded={artPreviewImg}
            >
              <DownloadLink href={artPreviewImg} download>
                {artPreviewImg ? "Download Preview Image" : <LoadingIcon />}
              </DownloadLink>
            </MainButton>
            <ArtFileButtonsWrapper>
              {isArtFileDeleted ? (
                <>
                  <MainButton
                    style={{
                      backgroundColor: "lightgrey",
                      cursor: "default",
                      width: "150px",
                    }}
                    disabled
                  >
                    Download Art File
                  </MainButton>
                  <MainButton
                    style={{
                      ...cntrTxtBtnsWithIcons,
                      ...deleteArtFileBtnStyle,
                      cursor: "default",
                    }}
                    disabled
                  >
                    <DoneIcon style={{ marginRight: "5px" }} /> Art File Deleted
                  </MainButton>
                </>
              ) : (
                <>
                  <MainButton type="button" style={{ width: "150px" }}>
                    <DownloadLink
                      href={`http://${window.location.host}${artFileDownload}`}
                      download
                    >
                      {artFile ? "Download Art File" : <LoadingIcon />}
                    </DownloadLink>
                  </MainButton>
                  <MainButton
                    onClick={_handleDeleteArtFileClick}
                    style={{
                      ...cntrTxtBtnsWithIcons,
                      ...deleteArtFileBtnStyle,
                    }}
                  >
                    <DeleteIcon style={{ marginRight: "5px" }} /> Delete Art
                    File
                  </MainButton>
                </>
              )}
            </ArtFileButtonsWrapper>
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
              <MainButton onClick={handleSave} style={cntrTxtBtnsWithIcons}>
                <SaveIcon style={{ marginRight: "5px" }} />
                Save
              </MainButton>
            </CenterButtonsWrapper>
          </SubmitCard>
        </ArtworkContainer>
        <CenterButtonsWrapper>
          <IconButton
            onClick={flipLeft}
            style={nextPreviousBtnStyle}
            disabled={isFlipLeftDisabled}
          >
            <KeyboardArrowLeftIcon /> Previous
          </IconButton>
          <IconButton
            onClick={flipRight}
            style={nextPreviousBtnStyle}
            disabled={isFlipRightDisabled}
          >
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
