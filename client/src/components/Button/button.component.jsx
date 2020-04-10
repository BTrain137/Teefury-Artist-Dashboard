import React from "react";
import {
  ButtonLgContainer,
  ButtonLgStyled,
  ButtonMdContainer,
  ButtonMdStyled,
  ButtonSmStyled,
} from "./button.styles";

export const ButtonLgCenter = ({ children, ...props }) => (
  <ButtonLgContainer>
    <ButtonLgStyled {...props}>{children}</ButtonLgStyled>
  </ButtonLgContainer>
);

export const ButtonLg = ({ children, ...props }) => (
  <ButtonLgStyled {...props}>{children}</ButtonLgStyled>
);

export const ButtonMd = ({ children, ...props }) => (
  <ButtonMdContainer>
    <ButtonMdStyled {...props}>{children}</ButtonMdStyled>
  </ButtonMdContainer>
);

export const ButtonSm = ({ children, ...props }) => (
  <ButtonSmStyled {...props}>{children}</ButtonSmStyled>
);
