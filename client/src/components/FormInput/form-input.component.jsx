import React from "react";
import { FormInputContainer, InputStyled } from "./form-input.styles";

const FormInput = ({ handleChange, label, isShowLabel, ...otherProps }) => (
  <FormInputContainer>
    {label ? (
      <label className={isShowLabel ? "form-label" : "display-none"}>
        {label}
      </label>
    ) : null}
    <InputStyled
      className="form-input"
      onChange={handleChange}
      {...otherProps}
    />
  </FormInputContainer>
);

export default FormInput;
