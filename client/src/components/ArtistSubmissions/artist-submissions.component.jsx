import React, { Component } from "react";
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
} from "./artist-submissions.styles";

class ArtistSubmissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: "",
      isShowingFilter: false,
      filterBy: "new",
    };
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

  render() {
    const { search, isShowingFilter, filterBy } = this.state;
    return (
      <SubmissionContainer>
        <TabHeader>
          <TabSubTitle>
            <TabSubLink to={`/artist/submissions`}>Submit Artwork</TabSubLink>
          </TabSubTitle>
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
        </TabArea>
      </SubmissionContainer>
    );
  }
}

export default ArtistSubmissions;
