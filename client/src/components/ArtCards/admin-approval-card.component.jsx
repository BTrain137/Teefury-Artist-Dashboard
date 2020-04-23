import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
} from "./art-submissions-card.styles";

const ArtistArtCard = ({ token, previewArt, delay, status, id }) => {
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    const fetchImage = () => {
      fetch(previewArt, { headers: { Authorization: `JWT ${token}` } })
        .then((res) => {
          return res.blob();
        })
        .then((blob) => {
          setImageSrc(URL.createObjectURL(blob));
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
        {status === "PENDING" ? (
          <Link to={`/artist/submissions/review/${id}`}>
            <CardFooter>Review Artwork</CardFooter>
          </Link>
        ) : null}
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
