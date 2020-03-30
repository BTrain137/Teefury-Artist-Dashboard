import React from "react";
import { InputStyled } from "./form-input.styles";

const FormInput = ({ handleChange, label, isLabelHidden, ...otherProps }) => (
  <>
    <InputStyled
      className="form-input"
      onChange={handleChange}
      {...otherProps}
    />
    {label ? (
      <label className={isLabelHidden ? "display-none" : ""}>{label}</label>
    ) : null}
  </>
);

export default FormInput;
