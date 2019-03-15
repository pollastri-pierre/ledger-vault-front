// @flow
import React, { Component } from "react";

export default (
  WrappedComponent: React$ComponentType<*>,
): React$ComponentType<*> => {
  class ClickToTop extends Component<*> {
    static handleEvent() {
      window.scrollTo(0, 0);
    }

    render() {
      return (
        <div onClick={ClickToTop.handleEvent} role="button" tabIndex={0}>
          <WrappedComponent />
        </div>
      );
    }
  }

  return ClickToTop;
};
