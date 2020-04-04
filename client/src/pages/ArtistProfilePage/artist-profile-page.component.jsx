import React from "react";

import Nav from "../../components/Nav/nav.component";
import ArtistProfile from "../../components/ArtistProfile/artist-profile.components";

import { ArtistContainer } from "./artist-profile-page.styles";

const ArtistProfilePage = () => (
  <ArtistContainer>
    <Nav />
    <ArtistProfile />
  </ArtistContainer>
);

export default ArtistProfilePage;
