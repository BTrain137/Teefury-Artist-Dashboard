import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
} from "./art-submissions-card.styles";

const ArtistArtCard = ({ token, previewArt, delay, status, id, title }) => {
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
        <p className="title">{title}</p>
        {status === "PENDING" ? (
          <Link to={`/artist/submissions/edit/${id}`}>
            <CardFooter>VIEW OR EDIT</CardFooter>
          </Link>
        ) : null}
      </CardWrapper>
    </CardContainer>
  );
};

export default ArtistArtCard;
