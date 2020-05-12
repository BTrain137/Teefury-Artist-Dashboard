import React from "react";
import {
  createMuiTheme,
  withStyles,
  makeStyles,
  ThemeProvider,
} from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import Button from "@material-ui/core/Button";
import { green, purple } from "@material-ui/core/colors";

const BootstrapButton = withStyles({
  root: {
    boxShadow: "none",
    textTransform: "none",
    fontSize: 16,
    padding: "6px 12px",
    border: "1px solid",
    lineHeight: 1.5,
    backgroundColor: "#0063cc",
    borderColor: "#0063cc",
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
    "&:hover": {
      backgroundColor: "#0069d9",
      borderColor: "#0062cc",
      boxShadow: "none",
    },
    "&:active": {
      boxShadow: "none",
      backgroundColor: "#0062cc",
      borderColor: "#005cbf",
    },
    "&:focus": {
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.5)",
    },
  },
})(Button);

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    "&:hover": {
      backgroundColor: purple[700],
    },
  },
}))(Button);

const useStyles = makeStyles((theme) => ({
  table: {
    // maxWidth: 300,
  },
  tableContainer: {
    maxWidth: 450,
    margin: "0 auto",
  },
  margin: {
    margin: theme.spacing(1),
  },
}));

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
});

export default function SimpleTable({ tableRowData }) {
  const classes = useStyles();

  const handleEdit = (rowData) => {
    console.log(rowData);
  }

  return (
    <TableContainer className={classes.tableContainer} component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Product Type</TableCell>
            <TableCell align="right">Commission Amount</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableRowData.length > 0
            ? tableRowData.map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row" id={row.id}>
                    {row.product_type}
                  </TableCell>
                  <TableCell align="right">{row.commissions_payout}</TableCell>
                  <TableCell align="right">
                    <ColorButton
                      variant="contained"
                      color="primary"
                      className={classes.margin}
                      onClick={() => handleEdit(row)}
                    >
                      Edit
                    </ColorButton>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
