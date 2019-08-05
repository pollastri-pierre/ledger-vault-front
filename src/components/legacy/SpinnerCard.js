// @flow
import React, { PureComponent } from "react";

import Spinner from "components/base/Spinner";
import { load } from "../GlobalLoading";

class SpinnerCard extends PureComponent<{ disableGlobalSpinner?: boolean }> {
  unload: ?Function;

  componentDidMount() {
    if (!this.props.disableGlobalSpinner) {
      this.unload = load();
    }
  }

  componentWillUnmount() {
    if (this.unload) {
      this.unload();
    }
  }

  render() {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: "-15px",
          marginTop: "-15px",
        }}
      >
        <Spinner />
      </div>
    );
  }
}

export default SpinnerCard;
