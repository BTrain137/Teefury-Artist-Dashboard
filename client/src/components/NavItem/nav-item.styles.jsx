import styled, { css } from "styled-components";
import { Link } from "react-router-dom"

const AnchorText = css`
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
`;

const NavWidth = css`
  width: 73%;
`;

export const SelectedLink = styled.div`
  ${NavWidth}
  padding: 15px;
  margin: 18px 0;
  border-left: 4px solid #214E51;
  background-color: #86C9CE;
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 6px 14px 1px rgba(0,0,0,0.2);
`;

export const LinkWrapper = styled.div`
  ${NavWidth}
  padding: 22px;
`;

export const SelectedAnchor = styled(Link)`
  color: #214E51;
  ${AnchorText}
`;

export const LinkAnchor = styled(Link)`
  color: white;
  ${AnchorText}
`;
