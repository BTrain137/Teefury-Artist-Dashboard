import React from "react";
import {
  ButtonLgContainer,
  ButtonLgStyled,
  ButtonMdContainer,
  ButtonMdStyled,
  ButtonSmStyled,
  BtnArtSubmitStyled,
  InputArtFileStyled,
  SpanStyled,
  InputArtPreviewWrapper,
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

export const BtnArtSubmit = ({ children, textAlign, ...props }) => (
  <ButtonMdContainer style={{ textAlign }}>
    <BtnArtSubmitStyled {...props}>{children}</BtnArtSubmitStyled>
  </ButtonMdContainer>
);

export const InputArtFile = ({ children, textAlign, ...props }) => (
  <ButtonMdContainer style={{ textAlign }}>
    <InputArtFileStyled {...props} />
    <SpanStyled>{children}</SpanStyled>
  </ButtonMdContainer>
);

export const InputArtPreview = ({ children, ...props }) => (
  <InputArtPreviewWrapper>
    {children}
    <InputArtFileStyled {...props} />
  </InputArtPreviewWrapper>
);
