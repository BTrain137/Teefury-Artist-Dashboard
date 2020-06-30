// import React, { Component } from "react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useParams } from "react-router-dom";

import { selectUserJWTToken } from "../../redux/user/user.selector";

// eslint-disable-next-line
import { Form, Input } from "../FormInput";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { AdminArtCart as ArtCard } from "../ArtCards";
// eslint-disable-next-line
import { ReactComponent as MagnifyGlassIcon } from "../../assets/magnify-glass.svg";
import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

import AdminArtApproval from "../AdminArtApproval";

import {
  SubmissionContainer,
  TabArea,
  FilterHeader,
  StatusHeader,
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
    submissionsArrIndex: 0,
    id: 0,
    isAdminArtApproval: false,
    isFlipLeftDisabled: false,
    isFlipRightDisabled: false,
  });
  const {
    // eslint-disable-next-line
    search,
    isShowingFilter,
    status,
    submissionsArr,
    submissionsArrIndex,
    id,
    isAdminArtApproval,
    isFlipLeftDisabled,
    isFlipRightDisabled,
  } = state;

  useEffect(
    () => {
      setState({
        ...state,
        submissionsArr: [],
      });

      const status = _getCurrentPath();
      _getSubmissions(status);
    },
    // eslint-disable-next-line
    [params]
  );

  // eslint-disable-next-line
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

    setState({
      ...state,
      status: status,
      isShowingFilter: false,
      submissionsArr: submissionsDetailsArr,
      isAdminArtApproval: false,
    });
  };

  const openAdminArtApproval = (event) => {
    const { id } = event.target;
    const index = parseInt(event.target.getAttribute("data-index"), 10);
    const isFlipLeftDisabled = index === 0 ? true : false;
    const isFlipRightDisabled =
      index === submissionsArr.length - 1 ? true : false;

    setState({
      ...state,
      id: id,
      submissionsArrIndex: index,
      isAdminArtApproval: true,
      isFlipLeftDisabled,
      isFlipRightDisabled,
    });
  };

  const closeAdminArtApproval = () => {
    setState({
      ...state,
      isAdminArtApproval: false,
      submissionsArr: [],
    });

    // Reset array for admin
    const status = _getCurrentPath();
    _getSubmissions(status);
  };

  const flipLeft = () => {
    if (submissionsArrIndex > 0) {
      let previousIndex = submissionsArrIndex - 1;
      const newCardId = submissionsArr[previousIndex].id;
      let isFlipLeftDisabled = previousIndex === 0 ? true : false;

      setState({
        ...state,
        id: newCardId,
        submissionsArrIndex: previousIndex,
        isFlipLeftDisabled,
        isFlipRightDisabled: false,
      });
    }
  };

  const flipRight = () => {
    if (submissionsArrIndex < submissionsArr.length - 1) {
      let nextIndex = submissionsArrIndex + 1;
      const newCardId = submissionsArr[nextIndex].id;
      const isFlipRightDisabled =
        nextIndex === submissionsArr.length - 1 ? true : false;

      setState({
        ...state,
        id: newCardId,
        submissionsArrIndex: nextIndex,
        isFlipLeftDisabled: false,
        isFlipRightDisabled,
      });
    }
  };

  return (
    <SubmissionContainer>
      <TabArea>
        <FilterHeader>
          <StatusHeader>
            <h2>{status}</h2>
          </StatusHeader>
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
              <FilterLink
                to="/admin/art-submissions/published"
                data-filter="PUBLISHED"
                status={status === "PUBLISHED" ? "selected" : ""}
              >
                PUBLISHED
              </FilterLink>
            </FilterContainer>
          ) : null}
        </FilterHeader>
        {isAdminArtApproval ? (
          <AdminArtApproval
            id={id}
            closeAdminArtApproval={closeAdminArtApproval}
            flipLeft={flipLeft}
            flipRight={flipRight}
            isFlipLeftDisabled={isFlipLeftDisabled}
            isFlipRightDisabled={isFlipRightDisabled}
          />
        ) : (
          <ArtCardContainer items={submissionsArr.length}>
            {submissionsArr.length > 0 ? (
              submissionsArr.map((submissionDetails, i) => {
                return (
                  <ArtCard
                    key={i}
                    {...submissionDetails}
                    token={token}
                    index={i}
                    openAdminArtApproval={openAdminArtApproval}
                  />
                );
              })
            ) : (
              <h2>No Artwork to be Viewed</h2>
            )}
          </ArtCardContainer>
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminArtSubmissions);
