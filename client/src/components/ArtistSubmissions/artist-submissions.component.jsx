import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import axios from "axios";

import { selectUserJWTToken } from "../../redux/user/user.selector";
import { selectSubmissionsError } from "../../redux/submissions/submissions.selector";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { ArtistArtCard as ArtCard } from "../ArtCards";
import { Form, Input } from "../FormInput";
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
  SearchBoxWrapper,
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
      allSubmissions: [],
    };
  }

  componentDidMount() {
    this._getAllSubmissions();
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClick = (event) => {
    const {
      dataset: { filter },
    } = event.target;
    this.setState({ filterBy: filter });
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

    this.setState({ allSubmissions: submissionsDetailsArr });
  };

  render() {
    const { search, isShowingFilter, filterBy, allSubmissions } = this.state;
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
            <SearchBoxWrapper>
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
            </SearchBoxWrapper>
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
                return <ArtCard key={i} {...submissionDetails} delay={i} />;
              })
            ) : (
              <h2>Hey Do you don't have any artwork Submit some!</h2>
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
