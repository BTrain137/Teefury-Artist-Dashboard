import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectArtistError } from "../../redux/artist/artist.selector";

import { ErrorTitle, ErrorList, FormTitle } from "./artist-err-msg.styles";

/**
 * @param {Object}   error          Error object
 * @param {Number}   error.status   HTTP error status
 * @param {String[]} error.messages Error message in an array
 */
const ArtistErrorMessages = ({ error, children }) => {
  if (error) {
    const { messages } = error;
    return (
      <ErrorList>
        <ErrorTitle>Please Correct Error(s)</ErrorTitle>
        {messages.length > 0 ? messages.map((errMsg, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: errMsg }} />
        )) : <li > Sorry! Something went wrong please let us know!</li>}
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
  error: selectArtistError,
});

export default connect(mapStateToProps)(ArtistErrorMessages);
