//@flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";
import Dialog from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

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

const styles = {
  paper: {
    maxWidth: "none"
  }
};

function Transition(props) {
  return <Slide direction="down" {...props} />;
}

class BlurDialog extends Component<{ open: boolean, nopadding: boolean }> {
  static defaultProps = {
    open: false,
    nopadding: false
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
  componentWillReceiveProps(props: *) {
    this.setActive(props.open);
  }
  render() {
    const { props } = this;
    return (
      <Dialog {...props} transition={Transition} transitionDuration={200} />
    );
  }
}

export default withStyles(styles)(BlurDialog);
