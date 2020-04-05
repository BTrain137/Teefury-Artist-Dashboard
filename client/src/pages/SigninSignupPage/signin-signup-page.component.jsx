import React from "react"
import CreateArtist from "../../components/CreateArtist/create-artist.component";
import Signup from "../../components/Signup/signup.component";
import Signin from "../../components/Signin/signin.component";

import { SignInSignUpContainer } from "./signin-signup-page.styles";

export const SignUpPage = () => (
  <SignInSignUpContainer>
    <Signup />
  </SignInSignUpContainer>
);

export const SignInPage = () => (
  <SignInSignUpContainer>
    <Signin />
  </SignInSignUpContainer>
);

export const CreateArtistPage = () => (
  <SignInSignUpContainer>
    <CreateArtist />
  </SignInSignUpContainer>
)
