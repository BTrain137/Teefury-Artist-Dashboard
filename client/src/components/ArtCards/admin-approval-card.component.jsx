import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

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

const ArtistArtCard = ({
  token,
  previewArt,
  id,
  artistName,
  title,
  createdAt,
}) => {
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
  }, [token, previewArt]);

  return (
    <CardContainer>
      <CardWrapper style={{ margin: "20px 10px" }}>
        <ImgCard
          src={imageSrc ? imageSrc : teefuryBirdLogo}
          alt="test"
          loaded={imageSrc ? true : false}
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
        </Figcaption>
        <Link to={`/admin/art-submissions/review/${id}`}>
          <CardFooter>Review Artwork</CardFooter>
        </Link>
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
