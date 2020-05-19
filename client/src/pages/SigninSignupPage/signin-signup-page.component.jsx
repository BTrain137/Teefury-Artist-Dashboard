import React from "react";

import CreateArtist from "../../components/ArtistCreate";
import Signup from "../../components/Signup";
import Signin from "../../components/Signin";
import ResetPassword from "../../components/ResetPassword";

import { SignInSignUpContainer } from "../SharedStyle/style";

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
);

export const ResetPasswordPage = () => (
  <SignInSignUpContainer>
    <ResetPassword />
  </SignInSignUpContainer>
);
