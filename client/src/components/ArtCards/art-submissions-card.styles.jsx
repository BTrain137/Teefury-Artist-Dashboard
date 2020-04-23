import styled, { css } from "styled-components";

export const CardContainer = styled.div``;

export const CardWrapper = styled.figure`
  position: relative;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);

    figcaption {
      display: initial;
    }
  }
`;

export const ImgCard = styled.img`
  ${(p) =>
    p.loaded
      ? css`
          box-shadow: 0px 7px 16px 2px rgba(0, 0, 0, 0.2);
          max-height: 250px;
        `
      : css`
          max-height: 210px;
        `}
  border-radius: 25px;
  height: 100%;
`;

export const CardFooter = styled.figcaption`
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  bottom: 2px;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 20px 0;
  border-radius: 0px 0px 28px 28px;
  cursor: pointer;
  display: none;
`;
