import React, { useState, useEffect } from "react";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
} from "./artist-submissions-card.styles";

const ArtistArtCard = ({ token, previewArt, delay, openModal }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchImage = () => {
      fetch(previewArt, { headers: { Authorization: `JWT ${token}` } })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          setTimeout(() => {
            setImageSrc(URL.createObjectURL(blob));
          }, (delay * 300 + 500) % 3500);
        });
    };
    fetchImage();
  }, [token, previewArt, delay]);

  return (
    <CardContainer>
      <CardWrapper>
        <ImgCard
          src={imageSrc ? imageSrc : teefuryBirdLogo}
          alt="test"
          loaded={imageSrc ? true : false}
        />
        <CardFooter onClick={openModal}>VIEW OR EDIT</CardFooter>
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
