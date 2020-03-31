import React from "react";

import {
  LinkWrapper,
  SelectedLink,
  LinkAnchor,
  SelectedAnchor
} from "./nav-item.styles";

const NavItem = ({ children, to, currentPath, ...otherProps }) => (
  <>
    {currentPath === to ? (
      <SelectedLink {...otherProps}>
        <SelectedAnchor to={to}>{children}</SelectedAnchor>
      </SelectedLink>
    ) : (
      <LinkWrapper>
        <LinkAnchor to={to}>{children}</LinkAnchor>
      </LinkWrapper>
    )}
  </>
);

export default NavItem;
