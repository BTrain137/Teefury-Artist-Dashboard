import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserError } from "../../redux/user/user.selector";

import { ErrorTitle, ErrorList, FormTitle } from "./error-msgs.styles";

/**
 * @param {Object}   error          Error object
 * @param {Number}   error.status   HTTP error status
 * @param {String[]} error.messages Error message in an array
 */
const UserError = ({ error, children }) => {
  if (error) {
    const { messages } = error;
    console.log("UserError: ", { messages });
    return (
      <ErrorList>
        <ErrorTitle>Please Correct Error(s)</ErrorTitle>
        {messages.length > 0 ? (
          messages.map((errMsg, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: errMsg }} />
          ))
        ) : (
          <li>Sorry Something Went Wrong.</li>
        )}
      </ErrorList>
    );
  } else {
    return (
      <>
        {children ? (
          <FormTitle>{children}</FormTitle>
        ) : (
          <div style={{ height: "85px" }} />
        )}
      </>
    );
  }
};

const mapStateToProps = createStructuredSelector({
  error: selectUserError,
});

export const UserErrorMessages = connect(mapStateToProps)(UserError);
