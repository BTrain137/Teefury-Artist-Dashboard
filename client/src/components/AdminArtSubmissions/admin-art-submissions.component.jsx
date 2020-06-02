// import React, { Component } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useLocation, useParams } from "react-router-dom";

import { selectUserJWTToken } from "../../redux/user/user.selector";

// eslint-disable-next-line
import { Form, Input } from "../FormInput";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { AdminArtCart as ArtCard } from "../ArtCards";
// eslint-disable-next-line
import { ReactComponent as MagnifyGlassIcon } from "../../assets/magnify-glass.svg";
import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";
import AdminArtApproval from "../AdminArtApproval";
import HighlightOffIcon from '@material-ui/icons/HighlightOff';

import {
  SubmissionContainer,
  TabArea,
  FilterHeader,
  // eslint-disable-next-line
  SearchBoxWrapper,
  // eslint-disable-next-line
  SearchBtn,
  AdjustableIconWrapper,
  FilterContainer,
  FilterLink,
  ArtCardContainer,
} from "../SharedStyle/art-submissions.styles";

const AdminArtSubmissions = ({ token }) => {
  const params = useParams();
  const [state, setState] = useState({
    search: "",
    isShowingFilter: false,
    status: "NEW",
    imageSrc: teefuryBirdLogo,
    submissionsArr: [],
    id: 0,
    isAdminArtApproval: false,
  });

  useEffect(() => {
    const status = _getCurrentPath();
    _getSubmissions(status);
  }, [params]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const _getCurrentPath = () => {
    const status = params.status.toUpperCase();

    return status;
  };

  const toggleFilterArea = () => {
    const { isShowingFilter } = state;
    setState({ ...state, isShowingFilter: !isShowingFilter });
  };

  const _getSubmissions = async (status) => {
    const {
      data: { submissionsDetailsArr },
    } = await axios.get(`/api/admin/submissions/${status}`, {
      headers: { Authorization: `JWT ${token}` },
    });

    console.log(submissionsDetailsArr);
    setState({
      ...state,
      status: status,
      isShowingFilter: false,
      submissionsArr: submissionsDetailsArr,
    });
  };

  const openAdminArtApproval = (event) => {
    const { id } = event.target;

    setState({
      ...state,
      id: id,
      isAdminArtApproval: true,
    });
  };

  const {
    // eslint-disable-next-line
    search,
    isShowingFilter,
    status,
    submissionsArr,
    isAdminArtApproval,
    id,
  } = state;

  return (
    <SubmissionContainer>
      {/* TODO: Render admin art approval here */}
      {isAdminArtApproval ? (
        <>
        <AdjustableIconWrapper>
          <HighlightOffIcon />
        </AdjustableIconWrapper>
        <AdminArtApproval id={id} />
        </>
      ) : (
        <TabArea>
          <FilterHeader>
            {/* <SearchBoxWrapper>
              <Form style={{ marginTop: "0" }}>
                <Input
                  name="search"
                  onChange={handleChange}
                  value={search}
                  placeholder="SEARCH"
                  style={{ fontSize: "15px", fontFamily: "sans-serif" }}
                />
                <SearchBtn>
                  <MagnifyGlassIcon />
                </SearchBtn>
              </Form>
            </SearchBoxWrapper> */}
            <AdjustableIconWrapper onClick={toggleFilterArea}>
              <AdjustablesIcon />
            </AdjustableIconWrapper>
            {isShowingFilter ? (
              <FilterContainer>
                <FilterLink
                  to="/admin/art-submissions/new"
                  data-filter="NEW"
                  status={status === "NEW" ? "selected" : ""}
                >
                  NEW
                </FilterLink>
                <FilterLink
                  to="/admin/art-submissions/pending"
                  data-filter="PENDING"
                  status={status === "PENDING" ? "selected" : ""}
                >
                  PENDING
                </FilterLink>
                <FilterLink
                  to="/admin/art-submissions/reviewed"
                  data-filter="REVIEWED"
                  status={status === "REVIEWED" ? "selected" : ""}
                >
                  REVIEWED
                </FilterLink>
                <FilterLink
                  to="/admin/art-submissions/approved"
                  data-filter="APPROVED"
                  status={status === "APPROVED" ? "selected" : ""}
                >
                  APPROVED
                </FilterLink>
                <FilterLink
                  to="/admin/art-submissions/declined"
                  data-filter="DECLINED"
                  status={status === "DECLINED" ? "selected" : ""}
                >
                  DECLINED
                </FilterLink>
              </FilterContainer>
            ) : null}
          </FilterHeader>
          <ArtCardContainer items={submissionsArr.length}>
            {submissionsArr.length > 0 ? (
              submissionsArr.map((submissionDetails, i) => {
                return (
                  <ArtCard
                    key={i}
                    {...submissionDetails}
                    delay={i}
                    token={token}
                    openAdminArtApproval={openAdminArtApproval}
                  />
                );
              })
            ) : (
              <h2>No {status} To Be Viewed</h2>
            )}
          </ArtCardContainer>
        </TabArea>
      )}
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtSubmissions);
