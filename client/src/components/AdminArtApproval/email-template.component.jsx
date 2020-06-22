import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import axios from "axios";
import Swal from "sweetalert2";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import { BtnArtSubmitLoading } from "../Button";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

import { MenuItem, Select } from "@material-ui/core";

import { MockEmailContainer, SelectWrapper } from "./admin-art-approval.styles";

const buttonAndTextFontStyle = {
  fontFamily:
    "'-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "15px",
};

const EmailTemplate = (props) => {
  const { id, token, title, artistEmail, changeEmailStatusColor } = props;

  const deniedEmailBody = `After reviewing your submission, ${title}, we've decided not to print your design at this time.<br/><br/>We receive a large number of high quality submissions on a daily basis and we can only choose a select few. Even when our basic design guidelines are met, sometimes it comes down to whether a design will resonate with the TeeFury audience to a level that will benefit both the artist and the site.<br/><br/>Please don't be discouraged! We appreciate every submission, and do hope to see more designs from you in the future.<br/><br/>Thanks for submitting!<br/><br/>The TeeFury Team`;

  const approvedDaily = `Congrats!<br/><br/>The Mad Scientists at TeeFury Labs have selected your submission, ${title}!, to be featured as a daily tee in the near future!<br/><br/>Since you've already given us your high-res artwork there's nothing left for you to do for now, if for some reason we have an issue with your artwork we will contact you with further instruction. You'll also receive an email to let you know once your print date has been chosen (this could take several weeks so we appreciate your patience).<br/><br/>Please also be aware that we may need to change the title of your design for marketing purposes. If you have any alternate titles please always feel free to include those in your notes!<br/><br/>Download our official logo to use in your tee promotions: <a href='/public/TeeFury+Logo.zip' rel='nofollow' download>TeeFury Logo</a> <br/><br/>As a reminder: you receive a $1 USD per-sale commission during the initial 24-hour sale period so be sure to get the word out to friends, family and fans! Once the initial 24-hour sale is complete, your design will roll into our Gallery for an increased commission of $2 USD per-sale with payment going out every month for items shipped the previous month.<br/><br/>Just one more note - we love to debut designs at TeeFury, so as a courtesy we ask that you refrain from releasing your design elsewhere on the internet until it's run as a daily tee.  We would like to get you the highest sales possible, and one way to do so is by increasing urgency and impulse to buy.  When a design is available everywhere, the impulse is diminished.  Let us offer your tee at a great price and push those sales for you - letting our marketing efforts work to their fullest extent, and allowing you to gain the most benefit possible! We respect this relationship and hope that you will too.<br/><br/>Questions? Feel free to drop us a line at art@teefury.com.<br/><br/>Congratulations again, and thanks for being a part of the Fury!<br/><br/>Snuggles,<br/><br/>The TeeFury Team<br/><br/>XOXOXO`;

  const approvedGallery = `Congrats!<br/><br/>Your submission, '${title}' , has been chosen to be added to the TeeFury gallery!<br/><br/>Since you've already provided your hi-res art there's nothing else we need from you for now. If for some reason we need additional information or a change needs to be made, we'll reach out to you. Please also keep in mind that we may need to change the title of the design for marketing purposes.<br/><br/>Once the design has been added to the site you will receive another confirmation email - just keep in mind this could take several weeks so we do appreciate your patience! In the meantime, feel free to send in other submissions for consideration!<br/><br/>If you have questions please feel free to drop us a line at art@teefury.com and we'll get back to you as quick as possible. <br/><br/>Thanks again for submitting!<br/><br/>Cheers,<br/><br/>The TeeFury Team<br/><br/>XOXOXO`;

  const [approvalType, setApprovalType] = useState("Not Selected");
  const [emailSubject, setEmailSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailBody, setEmailBody] = useState(
    "<h2>Please Select an Option</h2>"
  );

  useEffect(() => {
    setApprovalType("Not Selected");
  }, [id]);
  
  const handleOnChange = (event) => {
    const { value } = event.target;

    setApprovalType(value);

    switch (value) {
      case "Denied":
        return (
          setEmailBody(deniedEmailBody),
          setEmailSubject("We're sorry but your submission was declined.")
        );
      case "Approved - Daily":
        return (
          setEmailBody(approvedDaily),
          setEmailSubject("Your Artwork Has Been Selected!")
        );
      case "Approved - Gallery":
        return (
          setEmailBody(approvedGallery),
          setEmailSubject("Your Artwork Will Be Entering The Gallery!")
        );
      case "Not Selected":
        return setEmailBody("<h2>Please Select an Option</h2>");
      default:
        break;
    }
  };

  const sendEmail = async () => {
    const reqBody = {
      // Artist Email
      artistEmail,
      subject: emailSubject,
      htmlContent: emailBody,
      emailStatus: approvalType,
      id,
    };

    setIsLoading(true);
    try {
      await axios.put("/api/admin/email", reqBody, {
        headers: { Authorization: `JWT ${token}` },
      });

      changeEmailStatusColor(approvalType);

      Swal.fire({
        icon: "success",
        title: "Email Sent",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Email Not Sent",
      });
    }
    setIsLoading(false);
  };

  return (
    <MockEmailContainer>
      <SelectWrapper>
        <Select
          labelId="emailSelect"
          id="emailSelect"
          name="emailStatus"
          value={approvalType}
          onChange={handleOnChange}
          disableUnderline
          style={{
            ...buttonAndTextFontStyle,
            width: "100%",
            padding: "5px",
          }}
        >
          <MenuItem value={"Not Selected"} style={buttonAndTextFontStyle}>
            Select an Option
          </MenuItem>
          <MenuItem value={"Approved - Daily"} style={buttonAndTextFontStyle}>
            Approved - Daily
          </MenuItem>
          <MenuItem value={"Approved - Gallery"} style={buttonAndTextFontStyle}>
            Approved - Gallery
          </MenuItem>
          <MenuItem value={"Denied"} style={buttonAndTextFontStyle}>
            Denied
          </MenuItem>
        </Select>
      </SelectWrapper>
      {approvalType !== "Not Selected" ? (
        <>
          <BtnArtSubmitLoading
            type="button"
            textAlign="center"
            style={{ width: "95px", height: "45px" }}
            onClick={sendEmail}
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
          <div dangerouslySetInnerHTML={{ __html: emailBody }} />
        </>
      ) : (
        <h2>Please Select an Option</h2>
      )}
    </MockEmailContainer>
  );
};

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(EmailTemplate);
