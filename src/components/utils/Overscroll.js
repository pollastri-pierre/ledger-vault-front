//@flow
import React, { Component } from "react";

/**
 * This creates a blurred scroll container.
 * The container max height can be defined by the parent container.
 * It is recommended to use a PureComponent for the parent container
 * to try to avoid re-rendering as much as possible (children gets dups twice)
 * top and bottom define how much blur overflow (maximum height, opt-in).
 * It does not have to be precise as you can put a bigger value and have a container doing overflow:hidden.
 */
class Overscroll extends Component<{
  top: number, // how much to overflow on the top (opt-in)
  bottom: number, // how much to overflow on the bottom (opt-in)
  children: string | React$Node,
  blurSize: number,
  padding: number, // internal padding. make sure it's a bit bigger than blurSize to avoid blur overflow glitches
  pushScrollBarRight: number // how much pixel to push the scrollbar on the right
}> {
  static defaultProps = {
    top: 0,
    bottom: 0,
    backgroundColor: "white",
    blurSize: 6,
    padding: 12,
    pushScrollBarRight: 80
  };

  original: ?Element;
  node: ?Element;
  copy: ?Element;
  raf: *;

  componentDidMount() {
    const { original } = this;
    if (original) original.addEventListener("scroll", this.onScroll);
  }

  componentWillUnmount() {
    const { original } = this;
    if (original) original.removeEventListener("scroll", this.onScroll);
  }

  onScroll = () => {
    const { original, copy } = this;
    if (original && copy) {
      copy.scrollTop = original.scrollTop;
    }
  };

  onRef = (node: ?Element) => {
    this.node = node;
  };
  onCopyRef = (node: ?Element) => {
    this.copy = node;
  };
  onOriginalRef = (node: ?Element) => {
    this.original = node;
  };

  render() {
    const {
      top,
      bottom,
      children,
      blurSize,
      padding,
      pushScrollBarRight
    } = this.props;

    const rootStyle = {
      position: "relative",
      height: "100%",
      margin: -padding
    };
    const copyStyle = {
      position: "absolute",
      filter: "blur(" + blurSize + "px)",
      overflow: "hidden",
      width: "100%",
      top: `-${top - padding}px`,
      padding: padding,
      paddingTop: `${top}px `,
      paddingBottom: `${bottom}px`,
      height: `calc(100% + ${top + bottom - 2 * padding}px)`
    };
    const innerContainerStyle = {
      position: "relative",
      height: "100%"
    };
    const topLayerStyle = {
      position: "absolute",
      width: "100%",
      top: `-${top}px`,
      height: `${top}px`,
      background: "linear-gradient(to top, rgba(255, 255, 255, 0.5), white)"
    };
    const bottomLayerStyle = {
      position: "absolute",
      width: "100%",
      bottom: `-${bottom}px`,
      height: `${bottom}px`,
      background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.5), white)"
    };
    const originalStyle = {
      position: "relative",
      overflowY: "auto",
      height: "100%",
      background: "white", // NB used to be a prop. but if we want to customize it, we also need to customize the linear-gradient
      padding: padding,
      // for hiding ugly scrollbar
      marginRight: "-" + pushScrollBarRight + "px",
      paddingRight: pushScrollBarRight + padding + "px"
    };

    return (
      <div style={rootStyle} ref={this.onRef}>
        <div ref={this.onCopyRef} style={copyStyle}>
          {children}
        </div>
        <div style={innerContainerStyle}>
          <div style={topLayerStyle} />
          <div ref={this.onOriginalRef} style={originalStyle}>
            {children}
          </div>
          <div style={bottomLayerStyle} />
        </div>
      </div>
    );
  }
}

export default Overscroll;
