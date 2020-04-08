import React from "react";

import Nav from "../../components/Nav";
import ArtistProfile from "../../components/ArtistProfile";

import { ArtistContainer } from "./artist-profile-page.styles";

const ArtistProfilePage = () => (
  <ArtistContainer>
    <Nav />
    <ArtistProfile />
  </ArtistContainer>
);

export default ArtistProfilePage;
