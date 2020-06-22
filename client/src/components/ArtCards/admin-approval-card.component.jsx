import React, { useState, useEffect } from "react";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import MailOutlineIcon from "@material-ui/icons/MailOutline";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
  Figcaption,
  ArtTitle,
  Caption,
  ArtHeaders,
} from "./art-submissions-card.styles";

const AdminArtCard = ({
  token,
  previewArt,
  id,
  index,
  artistName,
  title,
  emailStatus,
  createdAt,
  openAdminArtApproval,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [emailStatusColor, setEmailStatusColor] = useState({
    color: "#6a6a6a",
  });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    const fetchImage = () => {
      const thumbImg = `/api/art-submissions-thumb/?src=${previewArt.substring(
        20
      )}`;
      fetch(thumbImg, { signal, headers: { Authorization: `JWT ${token}` } })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          setImageSrc(URL.createObjectURL(blob));
        })
        .catch((error) => {
          // console.error(error);
        });
    };
    fetchImage();

    _changeEmailStatusColor();
    return () => {
      controller.abort();
    };
  }, [token, previewArt]);

  const _changeEmailStatusColor = () => {
    switch (emailStatus) {
      case "Not emailed":
        setEmailStatusColor({ color: "white" });
        break;
      case "Approved - Daily":
        setEmailStatusColor({ color: "orange" });
        break;
      case "Approved - Gallery":
        setEmailStatusColor({ color: "green" });
        break;
      case "Denied":
        setEmailStatusColor({ color: "red" });
        break;
      default:
        setEmailStatusColor({ color: "white" });
    }
  };

  return (
    <CardContainer>
      <CardWrapper style={{ margin: "18px 15px" }}>
        <ImgCard
          src={imageSrc ? imageSrc : teefuryBirdLogo}
          alt={title}
          loaded={imageSrc ? "true" : ""}
        />
        <Figcaption>
          <ArtTitle style={{ fontSize: "16px" }}>
            {title.toUpperCase()}
          </ArtTitle>
          <Caption>Artist:</Caption>
          <ArtHeaders>{artistName}</ArtHeaders>
          <Caption>Submitted on:</Caption>
          <ArtHeaders style={{ fontSize: "14px" }}>
            {new Date(createdAt).toLocaleDateString()}
          </ArtHeaders>
          <MailOutlineIcon style={emailStatusColor} />
        </Figcaption>
        <CardFooter id={id} data-index={index} onClick={openAdminArtApproval}>
          Review Artwork
        </CardFooter>
      </CardWrapper>
    </CardContainer>
  );
};

export default AdminArtCard;
