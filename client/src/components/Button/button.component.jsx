import React from "react";
import { ButtonContainer, ButtonStyled } from "./button.styles";

export const ButtonCenter = ({ children, ...props }) => (
  <ButtonContainer>
    <ButtonStyled {...props}>{children}</ButtonStyled>
  </ButtonContainer>
);

export const Button = ({ children, ...props }) => (
  <ButtonStyled {...props}>{children}</ButtonStyled>
);
