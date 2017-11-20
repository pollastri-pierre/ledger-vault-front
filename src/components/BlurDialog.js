//@flow
import React, { Component } from "react";
import Dialog from "material-ui/Dialog";

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
      <Dialog
        overlayStyle={{
          backgroundColor: "rgba(0, 0, 0, 0.2)",
          boxShadow: "0px 20px 20px 0 rgba(0, 0, 0, 0.04)"
        }}
        bodyStyle={{
          color: "black",
          padding: props.nopadding ? "0" : "40px 40px 0"
        }}
        contentStyle={{
          width: "fit-content"
        }}
        paperProps={{
          rounded: false,
          style: {
            boxShadow: "0px 20px 20px 0 rgba(0, 0, 0, 0.04)"
          }
        }}
        {...props}
      />
    );
  }
}

export default BlurDialog;
