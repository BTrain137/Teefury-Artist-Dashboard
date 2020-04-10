import styled, { css } from "styled-components";

const buttonStyle = css`
  border-radius: 15px;
  font-size: 17px;
  font-weight: bold;
  background-color: #50B8BD;
  border: none;
  color: #0B7C80;
  cursor: pointer;
`;

export const ButtonLgContainer = styled.div`
  text-align: center;
`;

export const ButtonLgStyled = styled.button`
  ${buttonStyle}
  padding: 20px 25px;
`;

export const ButtonMdContainer = styled.div`
  margin-top: 20px;
`;

export const ButtonMdStyled = styled.button`
  padding: 10px 20px;
  border-radius: 13px;
  width: 100%;
  font-size: 19px;
  font-weight: bold;
  background-color: #50B8BD;
  color: white;
`;


export const ButtonSmStyled = styled.button`
  ${buttonStyle}
  padding: 10px 15px;
`;
