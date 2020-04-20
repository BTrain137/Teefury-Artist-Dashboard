import React, { Component } from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";

import { selectUserJWTToken } from "../../redux/user/user.selector";

import teefuryBirdLogo from "../../assets/teefury-bird.jpg";

import {
  CardContainer,
  CardWrapper,
  ImgCard,
  CardFooter,
} from "./artist-submissions-card.styles";

class ArtistArtCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageSrc: "",
    };
  }

  // static getDerivedStateFromProps(props, state) {
  //   const { imageSrc } = props;
  //   return { imageSrc }
  // }

  componentDidMount() {
    this._getImageFetch();
  }

  _getImageFetch = () => {
    const { token, previewArt, delay } = this.props;
    const imageLoadDelay = (delay * 300 + 500) % 3500;
    fetch(previewArt, { headers: { Authorization: `JWT ${token}` } })
      .then((res) => {
        return res.blob();
      })
      .then((blob) => {
        setTimeout(() => {
          this.setState({ imageSrc: URL.createObjectURL(blob) });
        }, imageLoadDelay);
      });
  };

  render() {
    const { imageSrc } = this.state;
    return (
      <CardContainer>
        <CardWrapper>
          <ImgCard
            src={imageSrc ? imageSrc : teefuryBirdLogo}
            alt="test"
            loaded={imageSrc ? true : false}
          />
          <CardFooter>VIEW OR EDIT</CardFooter>
        </CardWrapper>
      </CardContainer>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  token: selectUserJWTToken,
});

export default connect(mapStateToProps)(ArtistArtCard);
