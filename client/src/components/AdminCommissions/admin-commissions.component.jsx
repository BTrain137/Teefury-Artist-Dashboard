import React, { Component } from "react";

import Table from "./table.component";

import { SubmissionContainer, TabArea } from "../SharedStyle/styled.component";

class AdminCommissions extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <SubmissionContainer>
        <TabArea>
          <Table />
        </TabArea>
      </SubmissionContainer>
    );
  }
}

export default AdminCommissions;
