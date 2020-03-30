import React from "react";
import { Switch, Route } from "react-router-dom";

import SingInSignUpPage from "./pages/signin-signup-page/signin-signup-page";

import "./App.css";

function App() {
  return (
    <div>
      <Switch>
        <Route exact path="/" component={SingInSignUpPage} />
      </Switch>
    </div>
  );
}

export default App;
