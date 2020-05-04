import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { useTable, usePagination } from "react-table";

import { convertTime } from "../../utils/cleanData";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import styled from "styled-components";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;
    width: 100%;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
    text-align: center;
    margin-top: 25px;
  }
`;

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // Paginate
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
    },
    usePagination
  );

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* 
        Pagination can be built however you'd like. 
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
          {"<<"}
        </button>{" "}
        <button onClick={() => previousPage()} disabled={!canPreviousPage}>
          {"<"}
        </button>{" "}
        <button onClick={() => nextPage()} disabled={!canNextPage}>
          {">"}
        </button>{" "}
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
          {">>"}
        </button>{" "}
        <span>
          Page{" "}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{" "}
        </span>
        <span>
          | Go to page:{" "}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              gotoPage(page);
            }}
            style={{ width: "100px" }}
          />
        </span>{" "}
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
            },
            null,
            2
          )}
        </code>
      </pre>
    </>
  );
}

function App({ token }) {
  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: "order_created_at",
      },
      {
        Header: "Order #",
        accessor: "order",
      },
      {
        Header: "Title",
        accessor: "product_title",
      },
      {
        Header: "Vendor",
        accessor: "vendor",
      },
      {
        Header: "Product Type",
        accessor: "product_type",
      },
      {
        Header: "Commissions Amount",
        accessor: "commissions_amount",
      },
      {
        Header: "Paid or Unpaid",
        accessor: "commissions_paid",
      },
    ],
    []
  );

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getAllCommissions = async () => {
      const reqBody = {
        startAt: 1,
      };
      const {
        data: { commissionsDetailsArr },
      } = await axios.post("/api/admin/commissions", reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });
  
      const convertDetailsForAdmin = commissionsDetailsArr.map(details => {
        const { order_created_at, commissions_paid, ...otherProperty } = details;
        return {
          ...otherProperty,
          order_created_at: convertTime(order_created_at),
          commissions_paid: commissions_paid ? "Paid": "Unpaid",
        }
      })

      setTableData(convertDetailsForAdmin);
    };

    getAllCommissions();

  }, [token]);

  return (
    <Styles>
      <Table columns={columns} data={tableData} />
    </Styles>
  );
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(App);
