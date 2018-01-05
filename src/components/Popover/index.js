//@flow
import React, { Component } from "react";
import { Transition } from "react-transition-group";

const duration = 100;

const defaultStyle = {
  transition: `transform ${duration}ms ease`,
  opacity: 0,
  boxShadow: "0 2.5px 2.5px 0 rgba(0, 0, 0, 0.04)",
  background: "white",
  zIndex: 9,
  color: "black",
  transform: "translateY(-75%)",
  position: "absolute",
  top: "calc(100% - 25px)",
  left: "50px",
};

const transitionStyles = {
  entering: { opacity: 0, transform: "translateY(-25%)" },
  entered: { opacity: 1, transform: "translateY(0%)" },
  exited: { opacity: 0, transform: "translateY(-25%)" },
  exiting: { opacity: 1, transform: "translateY(-25%)" },
};

const Fade = ({ in: inProp, children }: { in: boolean, children: React$Node | string }) => (
  <Transition in={inProp} timeout={duration}>
    {(state: $Keys<typeof transitionStyles>) => (
      <div
        style={{
          ...defaultStyle,
          ...transitionStyles[state],
        }}
      >
        {children}
        <span className="triangle" />
      </div>
    )}
  </Transition>
);

class Popover extends Component<{ visible: *, children: * }, { isVisible: boolean }> {
  toggle = () => {
    this.setState({ isVisible: !this.state.isVisible });
  };

  state = { isVisible: false };

  componentWillMount() {
    document.addEventListener("click", this.clickHandle);
  }

  componentWillUnmount() {
    document.removeEventListener("click", this.clickHandle);
  }

  clickHandle = (e: *) => {
    if (!e.target.closest(".popover")) {
      this.setState({ isVisible: false });
    }
  };

  render() {
    const { visible, children } = this.props;
    return (
      <div className="popover" onClick={this.toggle}>
        <span>{visible}</span>
        <Fade in={this.state.isVisible}>{children}</Fade>
      </div>
    );
  }
}

export default Popover;
