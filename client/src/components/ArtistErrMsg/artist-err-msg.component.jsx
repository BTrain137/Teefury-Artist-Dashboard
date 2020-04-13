import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectArtistError } from "../../redux/artist/artist.selector";

import { ErrorTitle, ErrorList } from "./artist-err-msg.styles";

const ArtistErrorMessages = ({ error }) => {
  if (error) {
    const { messages } = error;
    console.log("ArtistErrorMessages", { messages });
    return (
      <ErrorList>
        <ErrorTitle>Please Correct Error(s)</ErrorTitle>
        {messages.map((errMsg, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: errMsg }} />
        ))}
      </ErrorList>
    );
  } else {
    return <div style={{ height: "85px" }} />;
  }
};

const mapStateToProps = createStructuredSelector({
  error: selectArtistError,
});

export default connect(mapStateToProps)(ArtistErrorMessages);
