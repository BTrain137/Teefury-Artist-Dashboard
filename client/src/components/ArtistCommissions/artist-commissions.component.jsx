import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectUserJWTToken } from "../../redux/user/user.selector";

import { ArtistTable } from "../Table";
import { fetchComForTable } from "../../utils/table";
import { SelectColumnFilter } from "../../libs/table";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";
import { SubmissionContainer, TabArea } from "../SharedStyle/styled";

const TABLE_COLUMNS = [
  {
    Header: "Date",
    accessor: "order_created_at",
    disableFilters: true,
  },
  {
    Header: "Title",
    accessor: "product_title",
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

class ArtistCommissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tableData: [],
      errorMsg: "",
    };
  }

  componentDidMount() {
    this.getAllCommissions();
  }

  setTableData = (data) => {
    this.setState({ tableData: data });
  };

  getAllCommissions = async () => {
    try {
      const { token } = this.props;
      const reqBody = {
        url: "/api/artist/commissions",
        method: "GET",
      };

      const tableData = await fetchComForTable(reqBody, token);

      this.setState({ tableData });
    } catch (error) {
      this.setState({
        errorMsg:
          "We Could not find any records. Let us know if its a mistake.",
      });
    }
  };

  render() {
    const { tableData, errorMsg } = this.state;
    return (
      <SubmissionContainer>
        <TabArea>
          {tableData.length > 1 ? (
            <ArtistTable columns={TABLE_COLUMNS} data={tableData} />
          ) : errorMsg ? (
            <h2>{errorMsg}</h2>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "50px",
              }}
            >
              <img className="rotating" src={teefuryBirdLogo} alt="tee bird" />
            </div>
          )}
        </TabArea>
      </SubmissionContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(ArtistCommissions);
