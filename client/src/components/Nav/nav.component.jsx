import React from "react";

import NavItem from "../NavItem/nav-item.component";

import { NavHeader, NavWrapper, Title, LogoImg, Subtitle } from "./nav.styles";
import logo from "../../assets/logo.png";

const Nav = ({ match }) => (
  <NavHeader>
    <Title>
      <LogoImg src={logo} alt="Teefury Logo" />
      Tee<b>Fury</b>
    </Title>
    <Subtitle>Dashboard</Subtitle>
    <NavWrapper>
      <NavItem currentPath={match.path} to="/artist/profile">
        Home
      </NavItem>
      <NavItem currentPath={match.path} to="/artist/submission">
        Submissions
      </NavItem>
      <NavItem currentPath={match.path} to="/artist/commission">
        Commission
      </NavItem>
      <NavItem currentPath={match.path} to="/artist/notifications">
        Notifications
      </NavItem>
    </NavWrapper>
  </NavHeader>
);

export default Nav;
