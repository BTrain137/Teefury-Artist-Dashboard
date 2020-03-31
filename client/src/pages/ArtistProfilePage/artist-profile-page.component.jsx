import React from "react"

import Nav from "../../components/Nav/nav.component";

import { ArtistContainer } from "./artist-profile-page.styles";

const ArtistProfilePage = props => (
  <ArtistContainer>
    <Nav {...props} />
  </ArtistContainer>
);

export default ArtistProfilePage;
