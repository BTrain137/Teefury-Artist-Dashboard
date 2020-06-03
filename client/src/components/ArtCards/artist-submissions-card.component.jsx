import React, { useState, useEffect } from "react";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
} from "./art-submissions-card.styles";

const ArtistArtCard = ({
  token,
  previewArt,
  status,
  id,
  title,
  openSubmissionsEdit,
}) => {
  const [imageSrc, setImageSrc] = useState("");

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

    return () => {
      controller.abort();
    };
  }, [token, previewArt]);

  return (
    <CardContainer>
      <CardWrapper>
        <ImgCard
          src={imageSrc ? imageSrc : teefuryBirdLogo}
          alt={title}
          loaded={imageSrc ? "true" : ""}
        />
        <p className="title">{title}</p>
        {status === "NEW" || status === "PENDING" ? (
          <CardFooter id={id} onClick={openSubmissionsEdit}>
            VIEW OR EDIT
          </CardFooter>
        ) : null}
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
