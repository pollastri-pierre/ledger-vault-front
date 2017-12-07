//@flow
import React, { Component } from "react";
import invariant from "invariant";
import { findDOMNode } from "react-dom";
import type { RestlayEnvironment } from "../restlay/connectData";
import SpinnerCard from "./spinners/SpinnerCard";

const regex = /(auto|scroll)/;

const style = (node: Element, prop: string) =>
  getComputedStyle(node).getPropertyValue(prop);

const scroll = (node: Element) =>
  regex.test(
    style(node, "overflow") +
      style(node, "overflow-y") +
      style(node, "overflow-x")
  );

const scrollparent = (node: ?Element): Element =>
  !node || node === document.body
    ? (invariant(document.body, "body is here"), document.body)
    : scroll(node) ? node : scrollparent(node.parentElement);

const resizeEventOn = (n: Element) => (n === document.body ? window : n);

export default class InfiniteScrollable extends Component<
  {
    children: React$Node,
    restlay: RestlayEnvironment,
    restlayVariable: string,
    style?: Object,
    loadPixelsInAdvance?: number,
    chunkSize?: number,
    loadMore?: Function
  },
  {
    loading: boolean
  }
> {
  static defaultProps = {
    loadPixelsInAdvance: 1000,
    chunkSize: 50
  };

  state = { loading: false };

  resizeBoundOnDom = null;

  componentDidMount() {
    this.syncScrollBodyListener();
    this.checkScroll();
  }

  componentWillUnmount() {
    this.unbindResizeEvent();
  }

  componentDidUpdate() {
    this.syncScrollBodyListener();
  }

  unbindResizeEvent() {
    if (this.resizeBoundOnDom) {
      this.resizeBoundOnDom.removeEventListener("scroll", this.checkScroll);
      this.resizeBoundOnDom = null;
    }
  }

  getScrollParent() {
    try {
      // $FlowFixMe
      return scrollparent(findDOMNode(this)); // eslint-disable-line react/no-find-dom-node
    } catch (e) {
      console.error(e);
    }
  }

  syncScrollBodyListener = () => {
    const node = this.getScrollParent();
    if (!node) return;
    const resizeBoundOnDom = resizeEventOn(node);
    if (resizeBoundOnDom !== this.resizeBoundOnDom) {
      this.unbindResizeEvent();
      this.resizeBoundOnDom = resizeBoundOnDom;
      resizeBoundOnDom.addEventListener("scroll", this.checkScroll);
    }
  };

  loadMoreUsingRelay = (): Promise<void> => {
    const { restlay, restlayVariable, chunkSize } = this.props;
    return restlay.setVariables({
      // FIXME getVariables() might not be appropriate here because can spam server?
      // ALSO we don't know when to ends, maybe we need more feedback in the result of setVariables?
      [restlayVariable]: restlay.getVariables()[restlayVariable] + chunkSize
    });
  };

  checkScroll = () => {
    if (this.state.loading) return;
    const container = this.getScrollParent();
    if (!container) return;
    const { height } = container.getBoundingClientRect();
    const { scrollHeight, scrollTop } = container;
    const bottom = scrollTop + height;
    const { loadPixelsInAdvance } = this.props;
    const advance = bottom - scrollHeight + loadPixelsInAdvance;
    if (advance > 0) {
      this.setState({ loading: true }, () =>
        Promise.resolve({
          advance,
          bottom,
          scrollHeight,
          height,
          scrollTop,
          loadPixelsInAdvance
        })
          .then(this.props.loadMore || this.loadMoreUsingRelay)
          .then(
            () => this.setState({ loading: false }), // technically could recall checkScroll here. in second callback of setState. fork it, try it, adapt it !
            e => {
              console.warn(e);
              this.setState({ loading: false });
            }
          )
      );
    }
  };

  render() {
    return [
      this.props.children,
      this.state.loading ? (
        <div key="loading" style={{ position: "relative", height: 50 }}>
          <SpinnerCard disableGlobalSpinner />
        </div>
      ) : null
    ];
  }
}
