import React, { Component } from "react";

import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

import Table from "./filtering";

import {
  SubmissionContainer,
  TabArea,
  FilterHeader,
  AdjustableIconWrapper,
  FilterContainer,
} from "./admin-commissions.styles";

class ArtistCommissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isShowingFilter: false,
    };
  }

  toggleFilterArea = () => {
    const { isShowingFilter } = this.state;
    this.setState({ isShowingFilter: !isShowingFilter });
  };

  render() {
    const { isShowingFilter } = this.state;
    return (
      <SubmissionContainer>
        <TabArea>
          <FilterHeader>
            <AdjustableIconWrapper onClick={this.toggleFilterArea}>
              <AdjustablesIcon />
            </AdjustableIconWrapper>
            {isShowingFilter ? (
              <FilterContainer>
                <div style={{ height: "100px", width: "50px" }} />
              </FilterContainer>
            ) : null}
          </FilterHeader>

          <Table />
        </TabArea>
      </SubmissionContainer>
    );
  }
}

export default ArtistCommissions;
