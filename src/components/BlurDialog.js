// @flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";

import Slide from "@material-ui/core/Slide";

const actives = [];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const styles = { paper: { maxWidth: "none" } };
const CustomDialog = withStyles(styles)(Dialog);

class BlurDialog extends Component<{
  open: boolean,
}> {
  static defaultProps = {
    open: false,
  };

  setActive = (active: boolean) => {
    const index = actives.indexOf(this);
    if (active && index === -1) actives.push(this); // add this in actives
    if (!active && index !== -1) actives.splice(index, 1); // remove this in actives
  };

  componentDidMount() {
    this.setActive(this.props.open);
  }

  componentWillUnmount() {
    this.setActive(false);
  }

  UNSAFE_componentWillUpdate(props: *) {
    this.setActive(props.open);
  }

  render() {
    const { props } = this;
    return (
      <CustomDialog
        {...props}
        TransitionComponent={Transition}
        transitionDuration={200}
      />
    );
  }
}

export default BlurDialog;
