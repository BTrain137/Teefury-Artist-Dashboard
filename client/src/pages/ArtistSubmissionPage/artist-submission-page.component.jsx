import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav/nav.component";
import ArtistSubmitArt from "../../components/ArtistSubmitArt";
import ArtistArtSubmissions from "../../components/ArtistArtSubmissions";
import ArtistSubmissionsEdit from "../../components/ArtistSubmissionsEdit";

import {
  ArtistContainer,
  SubmissionWrapper,
} from "./artist-submission-page.styles";

const ArtistSubmissionPage = () => {
  const { path } = useRouteMatch();
  return (
    <ArtistContainer>
      <Nav />
      <Switch>
        <Route exact path={path}>
          <SubmissionWrapper>
            <ArtistSubmitArt />
          </SubmissionWrapper>
        </Route>
        <Route path={`${path}/:status`}>
          <SubmissionWrapper>
            <ArtistArtSubmissions />
          </SubmissionWrapper>
        </Route>
        <Route path={`${path}/edit/:id`}>
          <SubmissionWrapper>
            <ArtistSubmissionsEdit />
          </SubmissionWrapper>
        </Route>
      </Switch>
    </ArtistContainer>
  );
};

export default ArtistSubmissionPage;
