// @flow

import React, { PureComponent, createRef } from "react";

type Props = {
  children: React$Node
};

type State = {
  showScrollIndicator: boolean
};

const styles = {
  outer: {
    borderTop: "1px solid rgb(224, 224, 224)",
    borderLeft: "1px solid rgb(224, 224, 224)",
    borderRight: "1px solid rgb(224, 224, 224)",
    position: "relative",
    overflow: "hidden"
  },
  inner: {
    overflowX: "scroll"
  },
  indicator: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    transition: "100ms linear opacity",
    boxShadow: "rgba(0, 0, 0, 0.2) 0px 0px 12px 5px"
  }
};

class TableScroll extends PureComponent<Props, State> {
  state = {
    showScrollIndicator: false
  };

  componentDidMount() {
    if (this.ref.current !== null) {
      this.toggleScrollIndicator();
      // $FlowFixMe for no reason flow can't infer that ref is not null
      this.ref.current.addEventListener("scroll", this.toggleScrollIndicator);
      const resizeObserver = new ResizeObserver(this.toggleScrollIndicator);
      // $FlowFixMe for no reason flow can't infer that ref is not null
      resizeObserver.observe(this.ref.current);
    }
  }

  componentWillUnmount() {
    if (this.ref.current) {
      this.ref.current.removeEventListener(
        "scroll",
        this.toggleScrollIndicator
      );
    }
  }

  // $FlowFixMe ???
  ref = createRef();

  toggleScrollIndicator = () => {
    window.requestAnimationFrame(() => {
      if (this.ref.current) {
        const { scrollWidth, scrollLeft, clientWidth } = this.ref.current;
        const showScrollIndicator = scrollWidth > scrollLeft + clientWidth;
        if (showScrollIndicator !== this.state.showScrollIndicator) {
          this.setState({ showScrollIndicator });
        }
      }
    });
  };

  render() {
    const { children } = this.props;
    const { showScrollIndicator } = this.state;
    const indicatorStyle = {
      opacity: showScrollIndicator ? 1 : 0,
      ...styles.indicator
    };
    return (
      <div style={styles.outer}>
        <div style={indicatorStyle} />
        <div style={styles.inner} ref={this.ref}>
          {children}
        </div>
      </div>
    );
  }
}

export default TableScroll;
