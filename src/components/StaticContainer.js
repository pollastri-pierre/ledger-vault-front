// @flow
import React, { Component } from "react";

// https://github.com/reactjs/react-static-container/blob/master/src/StaticContainer.react.js

export default class StaticContainer extends Component<*> {
  shouldComponentUpdate(nextProps: Object): boolean {
    return !!nextProps.shouldUpdate;
  }

  render() {
    const child = this.props.children;
    if (child === null || child === false) {
      return null;
    }
    return React.Children.only(child);
  }
}
