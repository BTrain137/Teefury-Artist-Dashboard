import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import { AdminTable } from "../Table";
import TableQueries from "./table-queries.component";
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
    filter: "text",
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
      maxDisplay: 1000,
      startDate: new Date(),
      endDate: new Date(),
      hasNewDatesAssigned: false,
      startAt: 0,
    };
  }

  componentDidMount() {
    this.getAllCommissions();
  }

  setTableData = (data) => {
    this.setState({ tableData: data });
  };

  getAllCommissions = async () => {
    const { token } = this.props;
    const { maxDisplay } = this.state;
    const reqBody = {
      url: "/api/admin/commissions",
      method: "POST",
      data: {
        maxDisplay,
      },
    };

    const tableData = await fetchComForTable(reqBody, token);

    this.setState({ tableData });
  };

  handleDateFilter = async ({ startDate, endDate }) => {
    const { token } = this.props;
    const { maxDisplay } = this.state;
    const reqBody = {
      url: "/api/admin/commissions/dates",
      method: "POST",
      data: {
        startDate,
        endDate,
        maxDisplay,
      },
    };

    const tableData = await fetchComForTable(reqBody, token);

    this.setState({
      tableData,
      startDate,
      endDate,
      hasNewDatesAssigned: true,
      startAt: 1,
    });
  };

  handleMaxDisplay = async (maxDisplay) => {
    const { hasNewDatesAssigned, startDate, endDate } = this.state;
    const { token } = this.props;
    let reqBody = {
      url: "/api/admin/commissions/dates",
      method: "POST",
      data: {
        maxDisplay,
      },
    };

    if (hasNewDatesAssigned) {
      reqBody.data = {
        ...reqBody.data,
        startDate,
        endDate,
      };
    }

    const tableData = await fetchComForTable(reqBody, token);

    this.setState({ tableData, maxDisplay, startAt: 1 });
  };

  handlePagDBNext = async (isPaginate) => {
    const { startAt, maxDisplay } = this.state;
    let newStartAt = 0;
    const { hasNewDatesAssigned, startDate, endDate } = this.state;
    const { token } = this.props;
    let reqBody = {
      url: "/api/admin/commissions/dates",
      method: "POST",
      data: {
        maxDisplay,
      },
    };

    if (hasNewDatesAssigned) {
      reqBody.data = {
        ...reqBody.data,
        startDate,
        endDate,
      };
    }

    if (isPaginate) {
      newStartAt = startAt + 1;
      reqBody.data = {
        ...reqBody.data,
        startAt: newStartAt,
      };
    }

    const tableData = await fetchComForTable(reqBody, token);
    this.setState({
      tableData,
      maxDisplay,
      startAt: isPaginate ? newStartAt : startAt,
    });
  };

  render() {
    const { tableData, maxDisplay, startDate, endDate } = this.state;
    const { token } = this.props;
    return (
      <SubmissionContainer>
        <TabArea>
          <TableQueries
            handleDateFilter={this.handleDateFilter}
            handleMaxDisplay={this.handleMaxDisplay}
            handlePagDBNext={this.handlePagDBNext}
            globalMaxDisplay={maxDisplay}
            globalStartDate={startDate}
            globalEndDate={endDate}
          />
          {tableData.length > 1 ? (
            <AdminTable
              columns={TABLE_COLUMNS}
              setTableData={this.setTableData}
              data={tableData}
              token={token}
              maxDisplay={maxDisplay}
            />
          ) : (
            <h2> No Records Found </h2>
          )}
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminCommissions);
