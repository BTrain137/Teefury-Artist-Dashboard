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
      filterBy: "new",
      imageSrc: teefuryBirdLogo,
      originalSubmissionsArr: [],
      newSubmissions: [],
    };
  }

  componentDidMount() {
    this._getAllSubmissions();
  }

  componentWillUnmount() {
    this.setState({ newSubmissions: [] });
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
      newSubmissions: filteredSubmissions,
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

    this.setState({
      newSubmissions: submissionsDetailsArr,
      originalSubmissionsArr: submissionsDetailsArr,
    });
  };

  render() {
    const { search, isShowingFilter, filterBy, newSubmissions } = this.state;

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
                  data-filter="new"
                  className={filterBy === "new" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  ALL
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
            {newSubmissions.length > 0 ? (
              newSubmissions.map((submissionDetails, i) => {
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
