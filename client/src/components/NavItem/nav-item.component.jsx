import React from "react";

import {
  LinkWrapperSelected,
  LinkAnchorSelected,
  LinkWrapper,
  LinkAnchor,
  AnchorStyle,
} from "./nav-item.styles";

export const NavItemLink = ({ children, to, currentPath, Icon, ...otherProps }) => (
  <>
    {currentPath === to ? (
      <LinkWrapperSelected {...otherProps}>
        <LinkAnchorSelected to={to}>
          <Icon />
          {children}
        </LinkAnchorSelected>
      </LinkWrapperSelected>
    ) : (
      <LinkWrapper {...otherProps}>
        <LinkAnchor to={to}>
          <Icon />
          {children}
        </LinkAnchor>
      </LinkWrapper>
    )}
  </>
);

// Style of a NavItem without being a link
export const NavItemStyle = ({ children, Icon, ...otherProps }) => (
  <LinkWrapper {...otherProps}>
    <AnchorStyle>
      {Icon ? <Icon /> : null}
      {children}
    </AnchorStyle>
  </LinkWrapper>
);
