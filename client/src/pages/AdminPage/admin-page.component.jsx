import React from "react";
import { Switch, Route, useRouteMatch } from "react-router-dom";

import Nav from "../../components/Nav/nav.component";
import AdminArtSubmissions from "../../components/AdminArtSubmissions";
import ArtistSubmissionsEdit from "../../components/ArtistSubmissionsEdit";

import {
  ArtistContainer,
  SubmissionWrapper,
} from "./admin-page.styles";

const AdminPage = () => {
  const { path } = useRouteMatch();
  return (
    <ArtistContainer>
      <Nav />
      <Switch>
        <Route exact path={`${path}`}>
          <SubmissionWrapper>
            <AdminArtSubmissions />
          </SubmissionWrapper>
        </Route>
        <Route path={`${path}/review/:id`}>
          <SubmissionWrapper>
            <ArtistSubmissionsEdit />
          </SubmissionWrapper>
        </Route>
      </Switch>
    </ArtistContainer>
  );
};

export default AdminPage;
