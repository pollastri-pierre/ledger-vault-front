//@flow
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import Dialog from "@material-ui/core/Dialog";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import Slide from "@material-ui/core/Slide";

let blurredCache = false;
function setBlurState(blurred: boolean) {
  if (typeof document === "undefined" || !document.body) return;
  if (blurred !== blurredCache) {
    blurredCache = blurred;
    if (blurred) {
      document.body.classList.add("blurDialogOpened");
    } else {
      document.body.classList.remove("blurDialogOpened");
    }
  }
}

const actives = [];

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

const styles = { paper: { maxWidth: "none" } };
const CustomDialog = withStyles(styles)(Dialog);

class BlurDialog extends Component<{
  open: boolean
}> {
  static defaultProps = {
    open: false
  };
  setActive = (active: boolean) => {
    const index = actives.indexOf(this);
    if (active && index === -1) actives.push(this); // add this in actives
    if (!active && index !== -1) actives.splice(index, 1); // remove this in actives
    setBlurState(actives.length > 0);
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
