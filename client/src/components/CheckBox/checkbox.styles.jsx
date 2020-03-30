import styled, { css } from "styled-components";

export const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
`;

export const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  // Hide checkbox visually but remain accessible to screen readers.
  // Source: https://polished.js.org/docs/#hidevisually
  border: 0;
  clip: rect(0 0 0 0);
  clippath: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;

export const Icon = styled.svg`
  fill: none;
  stroke: #0B777A;
  stroke-width: 4px;
`;

const checkedStyles = css`
  
`
const uncheckedStyles = css`
  
`

export const StyledCheckbox = styled.div`
  display: inline-block;
  // background: ${props => props.checked ? 'salmon' : 'papayawhip'};
  width: 20px;
  height: 20px;
  background: #F4F2F2;
  border: 1px solid #707070;
  border-radius: 7px;
  transition: all 150ms;

  ${props => props.checked ? checkedStyles : uncheckedStyles};

  ${HiddenCheckbox}:focus + & {
    border: 1px solid #0B777A;
  }

  ${Icon} {
    visibility: ${props => props.checked ? 'visible' : 'hidden'}
  }
`;
