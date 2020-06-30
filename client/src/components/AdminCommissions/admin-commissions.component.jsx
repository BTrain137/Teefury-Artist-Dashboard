import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { AdminTable } from "../Table";
import TableQueries from "../Table/table-queries.component";
import { fetchComForTable, fetchComByArtistForTable } from "../../utils/table";
import { SelectColumnFilter } from "../../libs/table";

import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ToggleButton from "@material-ui/lab/ToggleButton";

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
    accessor: "is_commissions_paid",
    Filter: SelectColumnFilter,
    filter: "includes",
  },
];

const TABLE_COLUMNS_ARTIST = [
  {
    Header: "Artist",
    accessor: "artist",
    filter: "fuzzyText",
  },
  {
    Header: "Product",
    accessor: "product",
    filter: "text",
  },
  {
    Header: "Product Type",
    accessor: "productType",
    Filter: SelectColumnFilter,
    filter: "equals",
  },
  {
    Header: "Quantity",
    accessor: "quantity",
    disableFilters: true,
  },
  {
    Header: "Paid Amount",
    accessor: "paidAmount",
    disableFilters: true,
  },
  {
    Header: "Unpaid Amount",
    accessor: "unpaidAmount",
    disableFilters: true,
  },
];

const AdminCommissions = (props) => {
  const [state, setState] = useState({
    tableData: [],
    startDate: new Date(),
    endDate: new Date(),
  });

  const [alignment, setAlignment] = useState("left");

  const { tableData, startDate, endDate } = state;
  const { token } = props;

  useEffect(() => {
    const start = new Date(startDate).toLocaleDateString("en-CA");
    const end = new Date(endDate).toLocaleDateString("en-CA");
    alignment === "left" ? _getAllCommissions(start, end) : _getAllCommissionsByArtist(start, end);
  }, []);

  const setTableData = (data) => {
    setState({ ...state, tableData: data });
  };

  const _getAllCommissions = async (startDate, endDate) => {
    const reqBody = {
      url: "/api/admin/commissions",
      method: "POST",
      data: {
        startDate,
        endDate,
      },
    };

    const tableData = await fetchComForTable(reqBody, token);

    setState({ ...state, tableData });
    return tableData;
  };

  const handleDateFilter = async ({ startDate, endDate }) => {
    let tableData = [];

    try {
      alignment === "left" ? tableData = await _getAllCommissions(startDate, endDate) : tableData = await _getAllCommissionsByArtist(startDate, endDate);

      setState({
        tableData,
        startDate,
        endDate,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
    }

    return;
  };

  const _getAllCommissionsByArtist = async (startDate, endDate) => {
    const reqBody = {
      url: "/api/admin/commissions/by-artist",
      method: "POST",
      data: {
        startDate,
        endDate,
      },
    };

    try {
      const tableData = await fetchComByArtistForTable(reqBody, token);

      setState({ ...state, tableData });
      return tableData;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Something went wrong. Please try again.",
      });
      return;
    }

  };

  const _handleToggle = (event, newAlignment) => {
    if (newAlignment !== null) {
      setAlignment(newAlignment);

      if (newAlignment === "right") {
        _getAllCommissionsByArtist(startDate, endDate);
      }

      if (newAlignment === "left") {
        _getAllCommissions(startDate, endDate);
      }
    }
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
        <ToggleButtonGroup
          size="large"
          value={alignment}
          exclusive
          onChange={_handleToggle}
          style={{ marginBottom: "15px" }}
        >
          <ToggleButton value="left">Summary</ToggleButton>
          <ToggleButton value="right">By Artist</ToggleButton>
        </ToggleButtonGroup>
        {alignment === "left" ? (
          <>
            {tableData.length > 1 ? (
              <AdminTable
                columns={TABLE_COLUMNS}
                setTableData={setTableData}
                type="summary"
                data={tableData}
                token={token}
              />
            ) : (
              <h2>No Records Found</h2>
            )}
          </>
        ) : (
          <>
            {tableData.length > 1 ? (
              <AdminTable
                columns={TABLE_COLUMNS_ARTIST}
                setTableData={setTableData}
                type="byArtist"
                data={tableData}
                token={token}
              />
            ) : (
              <h2> No Records Found </h2>
            )}
          </>
        )}
      </TabArea>
    </SubmissionContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminCommissions);
