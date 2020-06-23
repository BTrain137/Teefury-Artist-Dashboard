import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { AdminTable } from "../Table";
import TableQueries from "../Table/table-queries.component";
import { fetchComForTable } from "../../utils/table";
import { SelectColumnFilter } from "../../libs/table";

import {
  SubmissionContainer,
  TabArea,
  TabHeader,
  TabSubLink,
  TabSubTitle,
  TabTitle,
} from "../SharedStyle/styled";

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
    Header: "Artist",
    accessor: "artist",
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

const AdminCommissions = (props) => {
  const [state, setState] = useState({
    tableData: [],
    startDate: new Date(),
    endDate: new Date(),
  });

  const { tableData, startDate, endDate } = state;
  const { token } = props;

  useEffect(() => {
    getAllCommissions();
  }, []);

  const setTableData = (data) => {
    setState({ ...state, tableData: data });
  };

  const getAllCommissions = async () => {
    const reqBody = {
      url: "/api/admin/commissions",
      method: "GET",
    };

    const tableData = await fetchComForTable(reqBody, token);

    setState({ ...state, tableData });
  };

  const handleDateFilter = async ({ startDate, endDate }) => {
    const reqBody = {
      url: "/api/admin/commissions/dates",
      method: "POST",
      data: {
        startDate,
        endDate,
      },
    };

    try {
      const tableData = await fetchComForTable(reqBody, token);
      
      setState({
        tableData,
        startDate,
        endDate,
      });
      
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      })
    }

    return;
  };

  return (
    <SubmissionContainer>
      <TabHeader>
        <TabTitle>Commissions</TabTitle>
        <TabSubLink to={`/admin/commissions/payouts`}>
          <TabSubTitle>Payouts</TabSubTitle>
        </TabSubLink>
      </TabHeader>
      <TabArea>
        <TableQueries
          handleDateFilter={handleDateFilter}
          globalStartDate={startDate}
          globalEndDate={endDate}
        />
        {tableData.length > 1 ? (
          <AdminTable
            columns={TABLE_COLUMNS}
            setTableData={setTableData}
            data={tableData}
            token={token}
            globalStartDate={startDate}
            globalEndDate={endDate}
          />
        ) : (
          <h2> No Records Found </h2>
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminCommissions);
