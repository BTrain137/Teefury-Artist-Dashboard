import React, { useState } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import axios from "axios";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { BtnArtSubmitLoading } from "../Button";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

import { MockEmailContainer, SelectWrapper } from "./admin-art-approval.styles";

const DeniedEmail = ({ token, title, id, artistEmail }) => {
  const deniedEmailBody = `
  After reviewing your submission, ${title}, we've decided not to print your design at this time.<br/><br/>
  We receive a large number of high quality submissions on a daily basis and we can only choose a select few. Even when our basic design guidelines are met, sometimes it comes down to whether a design will resonate with the TeeFury audience to a level that will benefit both the artist and the site.<br/><br/>
  Please don't be discouraged! We appreciate every submission, and do hope to see more designs from you in the future.<br/><br/>
  Thanks for submitting!<br/><br/>
  The TeeFury Team
`;

  const [approvalType, setApprovalType] = useState("Not Selected");
  const [emailSubject, setEmailSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deniedMsg, setDeniedMsg] = useState(
    "<h2>Please Select an Denied Option</h2>"
  );

  const handleOnChange = (event) => {
    const { value } = event.target;

    setApprovalType(value);

    switch (value) {
      case "Denied":
        return (
          setDeniedMsg(deniedEmailBody),
          setEmailSubject("We're sorry but your submission was declined.")
        );
      case "Denied - DO NOT SEND":
        return (
          setDeniedMsg("<h2>DO NOT SEND</h2>"), setEmailSubject("DO NOT SEND")
        );
      case "Not Selected":
        return setDeniedMsg("<h2>Please Select an Denied Option</h2>");
      default:
        break;
    }
  };

  const sendEmail = async (htmlContent) => {
    const reqBody = {
      // Artwork
      id,
      status: approvalType,
      // // Artist Email
      artistEmail,
      subject: emailSubject,
      htmlContent,
    };

    setIsLoading(true);
    try {
      const { status } = await axios.post("/api/admin/email", reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });

      if(status === 202) {
        Swal.fire({
          icon: "success",
          title: "Denied Email Sent",
        });
      }
      else {
        Swal.fire({
          icon: "success",
          title: "Denied Updated",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Email Not Sent",
      });
    }
    setIsLoading(false);
  };

  const handleClick = (event) => {
    sendEmail(deniedMsg);
  };

  return (
    <MockEmailContainer>
      <SelectWrapper>
        <select onChange={handleOnChange}>
          <option value="Not Selected">Please Select an Denied Option</option>
          <option value="Denied">Denied</option>
          <option value="Denied - DO NOT SEND">Denied - DO NOT SEND</option>
        </select>
      </SelectWrapper>
      {approvalType !== "Not Selected" ? (
        <>
          <BtnArtSubmitLoading
            type="button"
            textAlign="center"
            style={{ width: "95px", height: "45px" }}
            onClick={handleClick}
          >
            {isLoading ? <LoadingIcon /> : "Send Email"}
          </BtnArtSubmitLoading>
          <div style={{ marginTop: "20px" }}>
            <span>
              <b>To:</b>{" "}
            </span>
            {artistEmail}
            <br />
            <span>
              <b>Subject:</b>{" "}
            </span>
            {emailSubject}
            <br />
            <br />
          </div>
          <div dangerouslySetInnerHTML={{ __html: deniedMsg }} />
        </>
      ) : (
        <h2>Please Select an Denied Option</h2>
      )}
    </MockEmailContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(DeniedEmail);
