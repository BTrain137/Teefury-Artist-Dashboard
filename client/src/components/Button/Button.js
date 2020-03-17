import React, { Component } from "react";

class Button extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleClick = evt => {
    console.log("evt", evt);
    console.log("this", this);
    fetch("/api/hello-world")
      .then(resp => {
        return resp.json();
      })
      .then(json => {
        console.log(json);
      });
  };

  render() {
    return (
      <>
        <button onClick={this.handleClick}>{this.props.children}</button>
      </>
    );
  }
}

export default Button;
