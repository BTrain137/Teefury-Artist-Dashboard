import styled from "styled-components";

export const FormInputContainer = styled.div`
  display: block;

  .form-label {
    margin-bottom: 6px;
    display: inline-block;
  }
`;

export const InputStyled = styled.input`
  background-color: #F4F2F2;
  border: none;
  padding: 16px;
  font-weight: bold;
  border-radius: 12px;
  display: block;
  margin: 0 auto;
  margin-bottom: 30px;
  min-width: 250px;

  &::placeholder {
    color: #B5B4B4;
  }
`;

