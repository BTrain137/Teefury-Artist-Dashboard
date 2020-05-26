import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

// eslint-disable-next-line
import { Form, Input } from "../FormInput";
import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { AdminArtCart as ArtCard } from "../ArtCards";
// eslint-disable-next-line
import { ReactComponent as MagnifyGlassIcon } from "../../assets/magnify-glass.svg";
import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

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
  FilterBtn,
  ArtCardContainer,
} from "../SharedStyle/art-submissions.styles";

class AdminApproval extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      isShowingFilter: false,
      filterBy: "NEW",
      imageSrc: teefuryBirdLogo,
      submissionsDetailsArr: [],
    };
  }

  async componentDidMount() {
    const { filterBy } = this.state;
    const submissionsDetailsArr = await this._getSubmissions(filterBy);
    this.setState({ submissionsDetailsArr }); 
  }

  componentWillUnmount() {
    this.setState({ submissionsDetailsArr: [] });
  }

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleClick = async (event) => {
    const {
      dataset: { filter },
    } = event.target;

    const submissionsDetailsArr = await this._getSubmissions(filter);

    this.setState({
      filterBy: filter,
      isShowingFilter: false,
      submissionsDetailsArr,
    });
  };

  toggleFilterArea = () => {
    const { isShowingFilter } = this.state;
    this.setState({ isShowingFilter: !isShowingFilter });
  };

  _getSubmissions = async (status) => {
    const { token } = this.props;
    const url = `/api/admin/submissions${status ? `?status=${status}` : ""}`;
    const {
      data: { submissionsDetailsArr },
    } = await axios.get(url, {
      headers: { Authorization: `JWT ${token}` },
    });

    return submissionsDetailsArr;
  };

  render() {
    const {
      // eslint-disable-next-line
      search,
      isShowingFilter,
      filterBy,
      submissionsDetailsArr,
    } = this.state;

    const { token } = this.props;
    return (
      <SubmissionContainer>
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
                  data-filter="NEW"
                  className={filterBy === "NEW" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  NEW
                </FilterBtn>
                <FilterBtn
                  data-filter="PENDING"
                  className={filterBy === "PENDING" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  PENDING
                </FilterBtn>
                <FilterBtn
                  data-filter="REVIEWED"
                  className={filterBy === "REVIEWED" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  REVIEWED
                </FilterBtn>
                <FilterBtn
                  data-filter="APPROVED"
                  className={filterBy === "APPROVED" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  APPROVED
                </FilterBtn>
                <FilterBtn
                  data-filter="DECLINED"
                  className={filterBy === "DECLINED" ? "selected" : ""}
                  onClick={this.handleClick}
                >
                  DECLINED
                </FilterBtn>
              </FilterContainer>
            ) : null}
          </FilterHeader>
          <ArtCardContainer>
            {submissionsDetailsArr.length > 0 ? (
              submissionsDetailsArr.map((submissionDetails, i) => {
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
              <h2>No {filterBy} To Be Viewed</h2>
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
