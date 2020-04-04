import React from "react";
import { withRouter } from "react-router-dom";

import { ReactComponent as BellIcon } from "../../assets/bell.svg";
import { ReactComponent as CogIcon } from "../../assets/cog.svg";
import { ReactComponent as ComputerIcon } from "../../assets/computer.svg";
import { ReactComponent as HouseIcon } from "../../assets/house.svg";
import NavItem from "../NavItem/nav-item.component";

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
      <NavItem to="/artist/profile" currentPath={pathname} Icon={HouseIcon}>
        Home
      </NavItem>
      <NavItem
        to="/artist/submission"
        currentPath={pathname}
        Icon={ComputerIcon}
      >
        Submissions
      </NavItem>
      <NavItem to="/artist/commission" currentPath={pathname} Icon={CogIcon}>
        Commission
      </NavItem>
      <NavItem
        to="/artist/notifications"
        currentPath={pathname}
        Icon={BellIcon}
      >
        Notifications
      </NavItem>
    </NavWrapper>
  </NavHeader>
);

export default withRouter(Nav);
