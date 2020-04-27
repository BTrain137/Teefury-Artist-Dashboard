import React, { useState } from "react";
import { MockEmailContainer, SelectWrapper } from "./admin-art-approval.styles";
import { BtnArtSubmitLoading } from "../Button";
import { ReactComponent as LoadingIcon } from "../../assets/loading.svg";

const ApprovedEmail = ({ title }) => {
  const approvedDaily = `
Congrats!<br/><br/>
The Mad Scientists at TeeFury Labs have selected your submission, ${title}!, to be featured as a daily tee in the near future!<br/><br/>
Since you've already given us your high-res artwork there's nothing left for you to do for now, if for some reason we have an issue with your artwork we will contact you with further instruction. You'll also receive an email to let you know once your print date has been chosen (this could take several weeks so we appreciate your patience).<br/><br/>
Please also be aware that we may need to change the title of your design for marketing purposes. If you have any alternate titles please always feel free to include those in your notes!<br/><br/>
Download our official logo to use in your tee promotions: TeeFury Logo <br/><br/>
As a reminder: you receive a $1 USD per-sale commission during the initial 24-hour sale period so be sure to get the word out to friends, family and fans! Once the initial 24-hour sale is complete, your design will roll into our Gallery for an increased commission of $2 USD per-sale with payment going out every month for items shipped the previous month.<br/><br/>
Just one more note - we love to debut designs at TeeFury, so as a courtesy we ask that you refrain from releasing your design elsewhere on the internet until it's run as a daily tee.  We would like to get you the highest sales possible, and one way to do so is by increasing urgency and impulse to buy.  When a design is available everywhere, the impulse is diminished.  Let us offer your tee at a great price and push those sales for you - letting our marketing efforts work to their fullest extent, and allowing you to gain the most benefit possible! We respect this relationship and hope that you will too.<br/><br/>
Questions? Feel free to drop us a line at art@teefury.com.<br/><br/>
Congratulations again, and thanks for being a part of the Fury!<br/><br/>
Snuggles,<br/><br/>
The TeeFury Team<br/><br/>
XOXOXO
`;

  const approvedGallery = `
Congrats!<br/><br/>
Your submission, '${title}' , has been chosen to be added to the TeeFury gallery! <br/><br/>
Since you've already provided your hi-res art there's nothing else we need from you for now. If for some reason we need additional information or a change needs to be made, we'll reach out to you. Please also keep in mind that we may need to change the title of the design for marketing purposes.<br/><br/>
Once the design has been added to the site you will receive another confirmation email - just keep in mind this could take several weeks so we do appreciate your patience! In the meantime, feel free to send in other submissions for consideration!<br/><br/>
If you have questions please feel free to drop us a line at art@teefury.com and we'll get back to you as quick as possible. <br/><br/>
Thanks again for submitting!<br/><br/>
Cheers,<br/><br/>
The TeeFury Team<br/><br/>
XOXOXO
`;

  const [approvalType, setApprovalType] = useState("Not Selected");
  const [approvalMsg, setApprovalMsg] = useState(
    "<h1>Please Select An option</h1>"
  );

  const handleOnChange = (event) => {
    const { value } = event.target;

    setApprovalType(value);

    switch (value) {
      case "Approved - Daily":
        return setApprovalMsg(approvedDaily);
      case "Approved - Gallery":
        return setApprovalMsg(approvedGallery);
      case "DO NOT SEND":
        return setApprovalMsg("<h1>DO NOT SEND</h1>");
      case "Not Selected":
        return setApprovalMsg("<h1>Please Select An option</h1>");
    }
  };

  const handleClick = (event) => {
    console.log(event.target);
    console.log(approvalMsg);
  };

  return (
    <MockEmailContainer>
      <SelectWrapper>
        <select onChange={handleOnChange}>
          <option value="Not Selected">Please Select An Option</option>
          <option value="Approved - Daily">Approved - Daily</option>
          <option value="Approved - Gallery">Approved - Gallery</option>
          <option value="DO NOT SEND">DO NOT SEND</option>
        </select>
      </SelectWrapper>
      {approvalType !== "Not Selected" ? (
        <BtnArtSubmitLoading
          type="button"
          textAlign="center"
          style={{ width: "95px", height: "45px" }}
          onClick={handleClick}
        >
          Send Email
        </BtnArtSubmitLoading>
      ) : null}
      <div dangerouslySetInnerHTML={{ __html: approvalMsg }} />
    </MockEmailContainer>
  );
};

export default ApprovedEmail;
