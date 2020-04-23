import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { Form, Input } from "../FormInput";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { AdminArtCart as ArtCard } from "../ArtCards";
import { ReactComponent as MagnifyGlassIcon } from "../../assets/magnify-glass.svg";
import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

import {
  SubmissionContainer,
  TabArea,
  FilterHeader,
  SearchBoxWrapper,
  SearchBtn,
  AdjustableIconWrapper,
  FilterContainer,
  FilterBtn,
  ArtCardContainer,
} from "./admin-art-submissions.styles";

class AdminApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      startAt: 0,
      search: "",
      isShowingFilter: false,
      filterBy: "pending",
      imageSrc: teefuryBirdLogo,
      originalSubmissionsArr: [],
      filteredSubmissions: [],
    };
  }

  componentDidMount() {
    this._getAllSubmissions();
  }

  componentWillUnmount() {
    this.setState({ filteredSubmissions: [] });
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
        if (filter === "all") return sub;
        else return sub.status.toUpperCase() === filter.toUpperCase();
      }
    );

    this.setState({
      filterBy: filter,
      isShowingFilter: false,
      filteredSubmissions: filteredSubmissions,
    });
  };

  toggleFilterArea = () => {
    const { isShowingFilter } = this.state;
    this.setState({ isShowingFilter: !isShowingFilter });
  };

  _getAllSubmissions = async () => {
    const { token } = this.props;
    const { startAt } = this.state;
    const {
      data: { submissionsDetailsArr },
    } = await axios.post(
      "/api/admin/submissions",
      { startAt },
      {
        headers: { Authorization: `JWT ${token}` },
      }
    );

    const onLoadFilterPending = submissionsDetailsArr.filter(
      (sub) => sub.status.toUpperCase() === "PENDING"
    );

    this.setState({
      filteredSubmissions: onLoadFilterPending,
      originalSubmissionsArr: submissionsDetailsArr,
    });
  };

  render() {
    const {
      search,
      isShowingFilter,
      filterBy,
      filteredSubmissions,
    } = this.state;

    const { token } = this.props;
    return (
      <SubmissionContainer>
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
                  data-filter="all"
                  className={filterBy === "all" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  ALL
                </FilterBtn>
                <FilterBtn
                  data-filter="pending"
                  className={filterBy === "pending" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  NEW
                </FilterBtn>
                <FilterBtn
                  data-filter="approved - gallery"
                  className={
                    filterBy === "approved - gallery" ? "selected" : ""
                  }
                  onClick={this.handleClick}
                >
                  APPROVED GALLERY
                </FilterBtn>
                <FilterBtn
                  data-filter="approved - daily"
                  className={filterBy === "approved - daily" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  APPROVED DAILY
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
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submissionDetails, i) => {
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
              <h2>Woops Something went wrong.</h2>
            )}
          </ArtCardContainer>
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminApproval);
