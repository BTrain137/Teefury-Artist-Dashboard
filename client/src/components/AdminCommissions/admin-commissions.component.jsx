import React, { Component } from "react";

import { ReactComponent as AdjustablesIcon } from "../../assets/adjustables.svg";

import "./admin-commissions.styles.css"

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

          <table>
            <tr>
              <th>Date</th>
              <th>Order#</th>
              <th>Title</th>
              <th>Vendor</th>
              <th>Commissions Amount</th>
              <th>Paid or Unpaid</th>
            </tr>
            <tr>
              <td>2020-04-08</td>
              <td>TF689660</td>
              <td>100 Cups of Coffee</td>
              <td>Mykelad</td>
              <td>Tee</td>
              <td>No</td>
            </tr>
            <tr>
              <td>2020-04-08</td>
              <td>TF689661</td>
              <td>Starts</td>
              <td>vp021</td>
              <td>Tee</td>
              <td>Yes</td>
            </tr>
          </table>
        </TabArea>
      </SubmissionContainer>
    );
  }
}

export default ArtistCommissions;
