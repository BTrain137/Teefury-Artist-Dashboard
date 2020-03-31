import React from "react";
import { Switch, Route } from "react-router-dom";

import SingInSignUpPage from "./pages/SigninSignupPage/signin-signup-page";

import "./App.css";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={SingInSignUpPage} />
        <Route exact path="/artist/profile" component={} />
      </Switch>
    </div>
  );
}

export default App;
