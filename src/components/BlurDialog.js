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

class BlurDialog extends Component<{ open: boolean, nopadding: boolean }> {
  static defaultProps = {
    open: false,
    nopadding: false
  };
  componentDidMount() {
    setBlurState(this.props.open);
  }
  componentWillUnmount() {
    setBlurState(false);
  }
  componentWillReceiveProps(props: *) {
    setBlurState(props.open);
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
