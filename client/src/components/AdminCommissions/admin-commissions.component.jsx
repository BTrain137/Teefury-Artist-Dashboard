import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import { AdminTable } from "../Table";
import { fetchComForTable } from "../../utils/table";
import { SelectColumnFilter } from "../../libs/table";

import { SubmissionContainer, TabArea } from "../SharedStyle/styled.component";

const TABLE_COLUMNS = [
  {
    Header: "Database Row Id",
    accessor: "dbRowId",
    disableFilters: true,
  },
  {
    Header: "Date",
    accessor: "order_created_at",
    disableFilters: true,
  },
  {
    Header: "Order #",
    accessor: "order",
    filter: "fuzzyText",
  },
  {
    Header: "Title",
    accessor: "product_title",
    filter: "fuzzyText",
  },
  {
    Header: "Vendor",
    accessor: "vendor",
    filter: "fuzzyText",
  },
  {
    Header: "Product Type",
    accessor: "product_type",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Commissions Amount",
    accessor: "commissions_amount",
    disableFilters: true,
  },
  {
    Header: "Paid or Unpaid",
    accessor: "commissions_paid",
    Filter: SelectColumnFilter,
    filter: "includes",
  },
];

class AdminCommissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
    };
  }

  componentDidMount() {
    this.getAllCommissions();
  }

  setTableData = (data) => {
    this.setState({ tableData: data });
  };

  handleTableButtonClick(obj) {
    console.log(obj.row);
  }

  getAllCommissions = async () => {
    const { token } = this.props;
    const reqBody = {
      url: "/api/admin/commissions",
      method: "POST",
      data: {
        startAt: 1,
      },
    };

    const tableData = await fetchComForTable(reqBody, token);

    this.setState({ tableData });
  };

  render() {
    const { tableData } = this.state;
    const { token } = this.props;
    return (
      <SubmissionContainer>
        <TabArea>
          {tableData.length > 1 ? (
            <AdminTable
              columns={TABLE_COLUMNS}
              setTableData={this.setTableData}
              data={tableData}
              token={token}
              onClick={this.handleTableButtonClick.bind(this)}
            />
          ) : null}
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminCommissions);
