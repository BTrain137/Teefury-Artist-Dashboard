import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { useTable, useFilters, usePagination, useRowSelect } from "react-table";

import TableToolbar from "./table-tool-bar.component";
import { fetchComForTable } from "../../utils/table";
import {
  DefaultColumnFilter,
  IndeterminateCheckbox,
  fuzzyTextFilterFn,
  startWithFn,
} from "../../libs/table";

import { TableContainer } from "./table.styles";

// Remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

const AdminTable = ({ columns, data, token, setTableData }) => {
  const filterTypes = React.useMemo(
    () => ({
      fuzzyText: fuzzyTextFilterFn,
      text: startWithFn,
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
    toggleAllRowsSelected,

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
    <TableContainer>
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
    </TableContainer>
  );
};

export default AdminTable;
