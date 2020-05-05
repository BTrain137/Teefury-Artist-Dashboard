import React, { useMemo, useEffect, useState } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import styled from "styled-components";
import { useTable, useRowSelect } from "react-table";

import Checkbox from "@material-ui/core/Checkbox";
import { convertTime } from "../../utils/cleanData";
import { selectUserJWTToken } from "../../redux/user/user.selector";

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

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
`;

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
        {/* <input type="checkbox" ref={resolvedRef} {...rest} /> */}
      </>
    );
  }
);

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    headerGroups,
    prepareRow,
    getTableBodyProps,
    rows,
    selectedFlatRows,
    state: { selectedRowIds },
  } = useTable(
    {
      columns,
      data,
    },
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
          {rows.slice(0, 10).map((row, i) => {
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
      <p>Selected Rows: {Object.keys(selectedRowIds).length}</p>

      <pre>
        <code>
          {JSON.stringify(
            {
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

      const convertDetailsForAdmin = commissionsDetailsArr.map((details) => {
        const {
          order_created_at,
          commissions_paid,
          ...otherProperty
        } = details;
        return {
          ...otherProperty,
          order_created_at: convertTime(order_created_at),
          commissions_paid: commissions_paid ? "Paid" : "Unpaid",
        };
      });

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
