//@flow
import React, { PureComponent } from "react";
import SpinnerCard from "../spinners/SpinnerCard";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    background: "white",
    width: "440px",
    height: "615px"
  }
};

class ModalLoading extends PureComponent<*> {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.base}>
        <SpinnerCard />
      </div>
    );
  }
}

export default withStyles(styles)(ModalLoading);
