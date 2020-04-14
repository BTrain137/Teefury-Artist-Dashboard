import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav/nav.component";
import ArtistSubmitArt from "../../components/ArtistSubmitArt";
import ArtistSubmissions from "../../components/ArtistSubmissions";

import { ArtistContainer, SubmissionWrapper } from "./artist-submission-page.styles";

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
        <Route exact path={`${path}/all`}>
          <SubmissionWrapper>
            <ArtistSubmissions />
          </SubmissionWrapper>
        </Route>
      </Switch>
    </ArtistContainer>
  );
};

export default ArtistSubmissionPage;
