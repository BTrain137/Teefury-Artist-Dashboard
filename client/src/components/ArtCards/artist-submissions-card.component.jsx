// eslint-disable-next-line
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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
  delay,
  status,
  id,
  title,
  openSubmissionsEdit,
}) => {
  // eslint-disable-next-line
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
          src={
            imageSrc
              ? `/api/art-submissions-thumb/?src=${previewArt.substring(20)}`
              : teefuryBirdLogo
          }
          alt="test"
          loaded={imageSrc ? "true" : ""}
        />
        <p className="title">{title}</p>
        {status === "PENDING" ? (
          <CardFooter id={id} onClick={openSubmissionsEdit}>
            VIEW OR EDIT
          </CardFooter>
        ) : null}
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
