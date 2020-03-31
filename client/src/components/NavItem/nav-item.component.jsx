import React from "react";

import {
  LinkWrapperSelected,
  LinkAnchorSelected,
  LinkWrapper,
  LinkAnchor,
} from "./nav-item.styles";

const NavItem = ({ children, to, currentPath, Icon, ...otherProps }) => (
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

export default NavItem;
