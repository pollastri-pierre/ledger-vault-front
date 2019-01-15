// @flow
import React, { Component } from "react";

class NoDataPlaceholder extends Component<{
  title: string
}> {
  render() {
    const { title } = this.props;
    return <p>{title}</p>;
  }
}

export default NoDataPlaceholder;
