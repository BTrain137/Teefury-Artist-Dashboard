import React from "react"

import Nav from "../../components/Nav/nav.component";

import { ArtistContainer } from "./artist-profile.styles";

const ArtistSubmissionPage = props => (
  <ArtistContainer>
    <Nav {...props} />
  </ArtistContainer>
);

export default ArtistSubmissionPage;
