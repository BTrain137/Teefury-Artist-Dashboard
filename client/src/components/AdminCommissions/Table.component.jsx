import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import { justDate } from "../../utils/cleanData";
import Swal from "sweetalert2";

import { useTable, useFilters, usePagination, useRowSelect } from "react-table";
import matchSorter from "match-sorter";
import Checkbox from "@material-ui/core/Checkbox";
import TableToolbar from "./table-too-bar.component";

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

const fetchComForTable = async (reqBody, token) => {
  const request = {
    ...reqBody,
    headers: { Authorization: `JWT ${token}` },
  };

  try {
    const {
      data: { commissionsDetailsArr },
    } = await axios(request);

    const convertDetailsForAdmin = commissionsDetailsArr.map((details) => {
      const { order_created_at, commissions_paid, ...otherProperty } = details;
      return {
        ...otherProperty,
        order_created_at: justDate(order_created_at),
        commissions_paid: commissions_paid ? "Paid" : "Unpaid",
      };
    });

    return convertDetailsForAdmin;
  } catch (error) {
    throw error;
  }
};

// Selection
const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <Checkbox ref={resolvedRef} {...rest} />
      </>
    );
  }
);

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

// Fuzzy find by a library
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

// Our table component
function Table({ columns, data, token, setTableData }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,

    // Paginate
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,

    // Selection
    selectedFlatRows,

    state: { pageIndex, pageSize, filters, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        hiddenColumns: ["dbRowId"],
      },
    },
    // Filter
    useFilters,

    // Paginated
    usePagination,

    // Selection
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );

  const updateCommissions = async (isPaid) => {
    const dbRowIds = selectedFlatRows.map((row) => {
      return row.values.dbRowId;
    });

    const reqBody = {
      method: "PUT",
      url: "/api/admin/commissions/update",
      data: {
        dbRowIds,
        isPaid,
        startAt: 1,
      },
    };

    try {
      const convertDetailsForAdmin = await fetchComForTable(reqBody, token);
      setTableData(convertDetailsForAdmin);

      Swal.fire({
        icon: "success",
        title: `Commissions marked as ${isPaid ? "Paid" : "Unpaid"}`,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Sorry, Something Went Wrong",
      });
    }
  };

  const markedAsPaid = () => {
    updateCommissions(true);
  };

  const markedAsUnpaid = () => {
    updateCommissions(false);
  };

  return (
    <>
      <TableToolbar
        numSelected={Object.keys(selectedRowIds).length}
        markedAsPaid={markedAsPaid}
        markedAsUnpaid={markedAsUnpaid}
      />
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps()}>
                  {column.render("Header")}
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => {
                  return (
                    <td key={j} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <br />

      {/* Pagination */}
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

      {process.env.NODE_ENV === "development" ? (
        <div>
          <pre>
            <code>
              {JSON.stringify(
                {
                  filters,
                  pageIndex,
                  pageSize,
                  pageCount,
                  canNextPage,
                  canPreviousPage,
                  selectedRowIds: selectedRowIds,
                  "selectedFlatRows[].original": selectedFlatRows.map(
                    (d) => d.original
                  ),
                },
                null,
                2
              )}
            </code>
          </pre>
        </div>
      ) : null}
    </>
  );
}

function AdminCommissionsTable({ token }) {
  const columns = useMemo(
    () => [
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
    ],
    []
  );

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const getAllCommissions = async () => {
      const reqBody = {
        url: "/api/admin/commissions",
        method: "POST",
        data: {
          startAt: 1,
        },
      };

      const commissions = await fetchComForTable(reqBody, token);

      setTableData(commissions);
    };

    getAllCommissions();
  }, [token]);

  return (
    <Styles>
      {tableData.length > 1 ? (
        <Table
          columns={columns}
          setTableData={setTableData}
          data={tableData}
          token={token}
        />
      ) : null}
    </Styles>
  );
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(AdminCommissionsTable);
