// @flow
import React, { PureComponent } from "react";
import CircularProgress from "@material-ui/core/CircularProgress";
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
      <CircularProgress
        size={30}
        color="primary"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: "-15px",
          marginTop: "-15px",
        }}
      />
    );
  }
}

export default SpinnerCard;
