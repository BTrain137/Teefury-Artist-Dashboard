import React, { useState, useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useParams } from "react-router-dom";

import { selectUserJWTToken } from "../../redux/user/user.selector";
import { selectSubmissionsError } from "../../redux/submissions/submissions.selector";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { ArtistArtCard as ArtCard } from "../ArtCards";
import ArtistSubmissionsEdit from "../ArtistSubmissionsEdit";
// eslint-disable-next-line
import { Form, Input } from "../FormInput";
// eslint-disable-next-line
import { ReactComponent as MagnifyGlassIcon } from "../../assets/magnify-glass.svg";
import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

import {
  SubmissionContainer,
  TabHeader,
  TabSubTitle,
  TabSubLink,
  TabTitle,
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

const ArtistArtSubmissions = ({ token }) => {
  const params = useParams();
  const [state, setState] = useState({
    search: "",
    isShowingFilter: false,
    status: "NEW",
    imageSrc: teefuryBirdLogo,
    submissionsArr: [],
    submissionsArrIndex: 0,
    submissionCard: null,
    id: 0,
    isSubmissionsEdit: false,
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
    isSubmissionsEdit,
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
    } = await axios.get(`/api/artist/submissions/${status}`, {
      headers: { Authorization: `JWT ${token}` },
    });

    setState({
      ...state,
      status: status,
      isShowingFilter: false,
      submissionsArr: submissionsDetailsArr,
      isSubmissionsEdit: false,
    });
  };

  const openSubmissionsEdit = (event) => {
    const { id } = event.currentTarget;
    const index = parseInt(event.target.getAttribute("data-index"), 10);
    const isFlipLeftDisabled = index === 0 ? true : false;
    const isFlipRightDisabled =
      index === submissionsArr.length - 1 ? true : false;

    setState({
      ...state,
      id: id,
      submissionsArrIndex: index,
      isSubmissionsEdit: true,
      isFlipLeftDisabled,
      isFlipRightDisabled,
    });
  };

  const closeSubmissionsEdit = () => {
    setState({
      ...state,
      isSubmissionsEdit: false,
      submissionsArr: [],
    });

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
      <TabHeader>
        <TabSubLink to={`/artist/submissions/`}>
          <TabSubTitle>Submit Artwork</TabSubTitle>
        </TabSubLink>
        <TabTitle>Submissions</TabTitle>
      </TabHeader>
      <TabArea>
        <FilterHeader>
          {/* <SearchBoxWrapper>
              <Form style={{ marginTop: "0" }}>
                <Input
                  name="search"
                  onChange={this.handleChange}
                  value={search}
                  placeholder="SEARCH"
                  style={{ fontSize: "15px", fontFamily: "sans-serif" }}
                />
                <SearchBtn>
                  <MagnifyGlassIcon />
                </SearchBtn>
              </Form>
            </SearchBoxWrapper> */}
          <StatusHeader>
            <h2>{status}</h2>
          </StatusHeader>
          <AdjustableIconWrapper onClick={toggleFilterArea}>
            <AdjustablesIcon />
          </AdjustableIconWrapper>
          {isShowingFilter ? (
            <FilterContainer>
              <FilterLink
                to="/artist/submissions/new"
                data-filter="NEW"
                status={status === "NEW" ? "selected" : ""}
              >
                NEW
              </FilterLink>
              <FilterLink
                to="/artist/submissions/pending"
                data-filter="PENDING"
                status={status === "PENDING" ? "selected" : ""}
              >
                PENDING
              </FilterLink>
              <FilterLink
                to="/artist/submissions/reviewed"
                data-filter="REVIEWED"
                status={status === "REVIEWED" ? "selected" : ""}
              >
                REVIEWED
              </FilterLink>
              <FilterLink
                to="/artist/submissions/approved"
                data-filter="APPROVED"
                status={status === "APPROVED" ? "selected" : ""}
              >
                APPROVED
              </FilterLink>
              <FilterLink
                to="/artist/submissions/declined"
                data-filter="DECLINED"
                status={status === "DECLINED" ? "selected" : ""}
              >
                DECLINED
              </FilterLink>
            </FilterContainer>
          ) : null}
        </FilterHeader>
        {isSubmissionsEdit ? (
          <ArtistSubmissionsEdit
            id={id}
            closeSubmissionsEdit={closeSubmissionsEdit}
            flipLeft={flipLeft}
            flipRight={flipRight}
            isFlipLeftDisabled={isFlipLeftDisabled}
            isFlipRightDisabled={isFlipRightDisabled}
          />
        ) : (
          <ArtCardContainer>
            {submissionsArr.length > 0 ? (
              submissionsArr.map((submissionDetails, i) => {
                return (
                  <ArtCard
                    key={i}
                    {...submissionDetails}
                    token={token}
                    index={i}
                    openSubmissionsEdit={openSubmissionsEdit}
                  />
                );
              })
            ) : (
              <h2>
                You don't have any {status.toLocaleLowerCase()} submissions
                currently.
              </h2>
            )}
          </ArtCardContainer>
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
  submissionsError: selectSubmissionsError,
});

export default connect(mapStateToProps)(ArtistArtSubmissions);
