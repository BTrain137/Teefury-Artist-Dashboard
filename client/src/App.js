import React from "react";
import { Switch, Route } from "react-router-dom";

import {
  SignUpPage,
  SignInPage,
  CreateArtistPage,
} from "./pages/SigninSignupPage/signin-signup-page.component";
import ArtistProfilePage from "./pages/ArtistProfilePage/artist-profile-page.component";
import ArtistSubmissionPage from "./pages/ArtistSubmissionPage";
import AdminPage from "./pages/AdminPage";

import "./App.css";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={SignInPage} />
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/artist/create" component={CreateArtistPage} />
      <Route exact path="/artist/profile" component={ArtistProfilePage} />
      <Route path="/artist/submissions" component={ArtistSubmissionPage} />
      <Route exact path="/artist/commissions" component={ArtistProfilePage} />
      {/* <Route exact path="/artist/notifications" component={ArtistProfilePage} /> */}
      <Route exact path="/admin/art-submissions" component={AdminPage} />
    </Switch>
  );
}

export default App;
