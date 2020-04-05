import React from "react";
import { Switch, Route } from "react-router-dom";

import {
  SignUpPage,
  SignInPage,
  CreateArtistPage,
} from "./pages/SigninSignupPage/signin-signup-page.component";
import ArtistProfilePage from "./pages/ArtistProfilePage/artist-profile-page.component";

import "./App.css";

function App() {
  return (
    <Switch>
      <Route exact path="/" component={SignInPage} />
      <Route exact path="/signup" component={SignUpPage} />
      <Route exact path="/artist/create" component={CreateArtistPage} />
      <Route exact path="/artist/profile" component={ArtistProfilePage} />
      <Route exact path="/artist/submission" component={ArtistProfilePage} />
      <Route exact path="/artist/commission" component={ArtistProfilePage} />
      <Route exact path="/artist/notifications" component={ArtistProfilePage} />
    </Switch>
  );
}

export default App;
