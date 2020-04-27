import styled, { css } from "styled-components";
import { FormInput, TextArea } from "../FormInput";

export const SubmissionContainer = styled.div`
  width: 90%;
  margin: 40px auto;
`;

export const TabArea = styled.div`
  box-shadow: 0px 7px 16px 2px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 55px;
  min-height: 70vh;
`;

export const ArtworkContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const SubmitCard = styled.div`
  margin-right: 65px;
`;

export const PreviewImage = styled.img`
  box-shadow: -3px 4px 24px -1px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  cursor: pointer;
  ${(p) =>
    p.isEnlargeImg
      ? css`
          max-width: 500px;
        `
      : css`
          max-width: 290px;
        `}
`;

export const IconContainer = styled.div`
  width: 85px;
`;

export const ArtPreview = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  box-shadow: -3px 4px 24px -1px rgba(0, 0, 0, 0.2);
  flex-direction: column;
  padding: 50px 15px 85px;
  position: relative;
  cursor: pointer;
  min-width: 250px;
  // min-width: 290px;
  // min-height: 310px;
`;

const previewTxt = css`
  font-weight: bold;
  display: inline-block;
  margin-top: 10px;
  width: 76%;
  text-align: center;
  color: #b5b4b4;
`;

export const IconTopSubtitle = styled.span`
  font-weight: bold;
  display: inline-block;
  width: 76%;
  text-align: center;
  color: #b5b4b4;
  font-size: 30px;
  font-family: sans-serif;
  margin-top: 20px;
  margin-bottom: -16px;
`;

export const IconBottomSubtitle = styled.span`
  ${previewTxt}
  bottom: 20px;
  font-size: 9px;
`;

export const FormInputArtistStyled = styled(FormInput)`
  font-size: 25px;
  margin-bottom: 15px;
  border-radius: 20px;
  cursor: not-allowed;
  color: #6a6a6a;
`;

const formInputStyle = css`
  font-size: 14px;
  margin-bottom: 15px;
  border-radius: 20px;
`;

export const FormInputTitleStyled = styled(FormInput)`
  ${formInputStyle}
`;

export const TextAreaStyled = styled(TextArea)`
  ${formInputStyle}
  min-height: 75px;
  // min-height: 265px;
`;

export const GreyTextArea = styled.div`
  font-size: 25px;
  border-radius: 20px;
  color: #6a6a6a;
  background-color: #f4f2f2;
  border: none;
  padding: 12px;
  font-weight: bold;
  display: block;
  margin: 0 auto;
  min-width: 250px;
  margin-bottom: 16px;
`;

export const CaptionTitle = styled.span`
  margin-left: 15px;
  color: #b5b4b4;
`;

export const DownloadLink = styled.a`
  color: #fff;
  text-decoration: none;
`;

// Approval Email

export const MockEmailContainer = styled.section`
  margin-top: 60px;
  border-top: 2px solid black;
`;

export const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 30px;
  border-radius: 10px;
  margin: 20px auto;
`;
