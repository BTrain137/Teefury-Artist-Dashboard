import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserAccount } from "../../redux/user/user.selector";

// import { ReactComponent as BellIcon } from "../../assets/bell.svg";
import { ReactComponent as CogIcon } from "../../assets/cog.svg";
import { ReactComponent as ApprovalIcon } from "../../assets/approval.svg";
import { ReactComponent as SignoutIcon } from "../../assets/signout.svg";
import { ReactComponent as ComputerIcon } from "../../assets/computer.svg";
import { ReactComponent as HouseIcon } from "../../assets/house.svg";
import { NavItemLink, NavItemStyle } from "../NavItem/nav-item.component";
import SignOut from "../Signout/signout.component";

import { NavHeader, NavWrapper, Title, LogoImg, Subtitle } from "./nav.styles";
import logo from "../../assets/logo.png";

const Nav = ({ userAccount }) => (
  <NavHeader>
    <Title>
      <LogoImg src={logo} alt="Teefury Logo" />
      Tee<b>Fury</b>
    </Title>
    <Subtitle>Dashboard</Subtitle>
    <NavWrapper>
      <NavItemLink to="/artist/profile" pathToMatch="/profile" Icon={HouseIcon}>
        Home
      </NavItemLink>
      <NavItemLink
        to="/artist/submissions"
        pathToMatch="/submissions"
        Icon={ComputerIcon}
      >
        Submissions
      </NavItemLink>
      <NavItemLink
        to="/artist/commissions"
        pathToMatch="/commissions"
        Icon={CogIcon}
      >
        Commissions
      </NavItemLink>
      {/* <NavItemLink
        to="/artist/notifications"
        pathToMatch="/notifications"
        Icon={BellIcon}
      >
        Notifications
      </NavItemLink> */}
      {userAccount.isAdmin ? (
        <NavItemLink
          to="/admin/art-submissions"
          pathToMatch="/art-submissions"
          Icon={ApprovalIcon}
        >
          Art Review
        </NavItemLink>
      ) : null}
      <NavItemStyle Icon={SignoutIcon}>
        <SignOut />
      </NavItemStyle>
    </NavWrapper>
  </NavHeader>
);

const mapStateToProps = createStructuredSelector({
  userAccount: selectUserAccount,
});

export default connect(mapStateToProps)(Nav);
