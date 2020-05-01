import React from "react";

import Nav from "../../components/Nav";
import AdminCommissions from "../../components/AdminCommissions";

import {
  ArtistContainer,
  CommissionsWrapper,
} from "./admin-commissions.styles";

const AdminCommissionsPage = () => (
  <ArtistContainer>
    <Nav />
    <CommissionsWrapper>
      <AdminCommissions />
    </CommissionsWrapper>
  </ArtistContainer>
);

export default AdminCommissionsPage;
