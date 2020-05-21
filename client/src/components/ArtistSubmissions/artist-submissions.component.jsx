import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";
import { selectSubmissionsError } from "../../redux/submissions/submissions.selector";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { ArtistArtCard as ArtCard } from "../ArtCards";
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
  // eslint-disable-next-line
  SearchBoxWrapper,
  // eslint-disable-next-line
  SearchBtn,
  AdjustableIconWrapper,
  FilterContainer,
  FilterBtn,
  ArtCardContainer,
} from "./artist-submissions.styles";

class ArtistSubmissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      isShowingFilter: false,
      filterBy: "new",
      imageSrc: teefuryBirdLogo,
      originalSubmissionsArr: [],
      allSubmissions: [],
      submissionCard: null,
    };
  }

  componentDidMount() {
    this._getAllSubmissions();
  }

  componentWillUnmount() {
    this.setState({ allSubmissions: [] });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClick = (event) => {
    const {
      dataset: { filter },
    } = event.target;

    const filteredSubmissions = this.state.originalSubmissionsArr.filter(
      (sub) => {
        if (filter === "new") return sub;
        else return sub.status.toUpperCase() === filter.toUpperCase();
      }
    );

    this.setState({
      filterBy: filter,
      isShowingFilter: false,
      allSubmissions: filteredSubmissions,
    });
  };

  toggleFilterArea = () => {
    const { isShowingFilter } = this.state;
    this.setState({ isShowingFilter: !isShowingFilter });
  };

  _getAllSubmissions = async () => {
    const { token } = this.props;
    const {
      data: { submissionsDetailsArr },
    } = await axios.get("/api/artist/submissions", {
      headers: { Authorization: `JWT ${token}` },
    });

    this.setState({
      allSubmissions: submissionsDetailsArr,
      originalSubmissionsArr: submissionsDetailsArr,
    });
  };

  render() {
    // eslint-disable-next-line
    const { search, isShowingFilter, filterBy, allSubmissions } = this.state;

    const { token } = this.props;
    return (
      <SubmissionContainer>
        <TabHeader>
          <TabSubLink to={`/artist/submissions`}>
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
            <AdjustableIconWrapper onClick={this.toggleFilterArea}>
              <AdjustablesIcon />
            </AdjustableIconWrapper>
            {isShowingFilter ? (
              <FilterContainer>
                <FilterBtn
                  data-filter="new"
                  className={filterBy === "new" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  NEW
                </FilterBtn>
                <FilterBtn
                  data-filter="pending"
                  className={filterBy === "pending" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  PENDING
                </FilterBtn>
                <FilterBtn
                  data-filter="reviewed"
                  className={filterBy === "reviewed" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  REVIEWED
                </FilterBtn>
                <FilterBtn
                  data-filter="approved"
                  className={filterBy === "approved" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  APPROVED
                </FilterBtn>
                <FilterBtn
                  data-filter="declined"
                  className={filterBy === "declined" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  DECLINED
                </FilterBtn>
              </FilterContainer>
            ) : null}
          </FilterHeader>
          <ArtCardContainer>
            {allSubmissions.length > 0 ? (
              allSubmissions.map((submissionDetails, i) => {
                return (
                  <ArtCard
                    key={i}
                    {...submissionDetails}
                    delay={i}
                    token={token}
                  />
                );
              })
            ) : (
              <h2>Sorry you don't have any commissions yet.</h2>
            )}
          </ArtCardContainer>
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
  submissionsError: selectSubmissionsError,
});

export default connect(mapStateToProps)(ArtistSubmissions);
