import React from "react";
import { withRouter } from "react-router-dom";

import { ReactComponent as BellIcon } from "../../assets/bell.svg";
import { ReactComponent as CogIcon } from "../../assets/cog.svg";
import { ReactComponent as ComputerIcon } from "../../assets/computer.svg";
import { ReactComponent as HouseIcon } from "../../assets/house.svg";
import { NavItemLink, NavItemStyle } from "../NavItem/nav-item.component";
import SignOut from "../Signout/signout.component";

import { NavHeader, NavWrapper, Title, LogoImg, Subtitle } from "./nav.styles";
import logo from "../../assets/logo.png";

const Nav = ({ location: { pathname } }) => (
  <NavHeader>
    <Title>
      <LogoImg src={logo} alt="Teefury Logo" />
      Tee<b>Fury</b>
    </Title>
    <Subtitle>Dashboard</Subtitle>
    <NavWrapper>
      <NavItemLink to="/artist/profile" currentPath={pathname} Icon={HouseIcon}>
        Home
      </NavItemLink>
      <NavItemLink
        to="/artist/submission"
        currentPath={pathname}
        Icon={ComputerIcon}
      >
        Submissions
      </NavItemLink>
      <NavItemLink to="/artist/commission" currentPath={pathname} Icon={CogIcon}>
        Commission
      </NavItemLink>
      <NavItemLink
        to="/artist/notifications"
        currentPath={pathname}
        Icon={BellIcon}
      >
        Notifications
      </NavItemLink>
      <NavItemStyle>
        <SignOut />
      </NavItemStyle>
    </NavWrapper>
  </NavHeader>
);

export default withRouter(Nav);
