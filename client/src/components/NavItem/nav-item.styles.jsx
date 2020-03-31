import styled, { css } from "styled-components";
import { Link } from "react-router-dom"

const AnchorText = css`
  font-weight: bold;
  text-transform: uppercase;
  text-decoration: none;
`;

const NavItemSharedStyle = css`
  width: 73%;
  display: flex;
  align-items: center;
`;

const Icon = css`
  margin-right: 20px;
  width: 23px;
`;


export const LinkWrapperSelected = styled.div`
  padding: 15px;
  margin: 16px 0;
  margin-right: 15px;
  border-left: 4px solid #214E51;
  background-color: #86C9CE;
  border-radius: 0 10px 10px 0;
  box-shadow: 0px 6px 14px 1px rgba(0,0,0,0.2);

  .icon {
    ${Icon}
  }
`;

export const LinkWrapper = styled.div`
  padding: 22px;
  padding-top: 33px;

  .icon {
    ${Icon}
    fill: #ffffff;
  }
`;

export const LinkAnchorSelected = styled(Link)`
  ${NavItemSharedStyle}
  ${AnchorText}
  color: #214E51;
`;

export const LinkAnchor = styled(Link)`
  ${AnchorText}
  ${NavItemSharedStyle}
  color: #ffffff;
`;
