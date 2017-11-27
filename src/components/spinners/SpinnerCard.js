// @flow
import React, { PureComponent } from "react";
import CircularProgress from "material-ui/CircularProgress";
import { load } from "../GlobalLoading";

class SpinnerCard extends PureComponent<{}> {
  unload: Function;
  componentDidMount() {
    this.unload = load();
  }
  componentWillUnmount() {
    this.unload();
  }
  render() {
    return (
      <CircularProgress
        size={30}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          marginLeft: "-15px",
          marginTop: "-15px"
        }}
      />
    );
  }
}

export default SpinnerCard;
