// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import Modal from "components/base/Modal";
import type { MemoryHistory } from "history";

const isEmptyChildren = children => React.Children.count(children) === 0;

function renderInner(routeProps, { component, render, children }, extraProps) {
  const { match } = routeProps;
  const props = { ...routeProps, ...extraProps };
  // Same rendering logic as in https://github.com/ReactTraining/react-router/blob/master/packages/react-router/modules/Route.js
  if (component) {
    return match ? React.createElement(component, props) : null;
  }
  if (render) {
    return match ? render(props) : null;
  }
  if (typeof children === "function") {
    return children(props);
  }
  if (children && !isEmptyChildren(children)) {
    return React.Children.only(children);
  }

  return null;
}

class ModalRoute extends Component<{
  disableBackdropClick?: boolean,
  component?: *,
  render?: *,
  children?: *,
  transparent?: boolean,
  history: MemoryHistory,
}> {
  _unmounted: boolean = false;

  componentWillUnmount() {
    this._unmounted = true;
  }

  lastPath: ?string = null;

  lastSearch: ?string = null;

  onClose = () => {
    if (this._unmounted) return;
    const { history } = this.props;
    history.push({
      pathname: resolveCloseURL(history, this.lastPath),
      search: this.lastSearch || "",
    });
  };

  render() {
    const {
      component, // eslint-disable-line no-unused-vars
      render, // eslint-disable-line no-unused-vars
      children, // eslint-disable-line no-unused-vars
      history,
      disableBackdropClick,
      transparent,
      ...rest
    } = this.props;
    return (
      <Route {...rest}>
        {routeProps => {
          const inner = renderInner(routeProps, this.props, {
            close: this.onClose,
          });
          const open = !!routeProps.match;
          if (!open) {
            this.lastSearch = routeProps.location.search;
            this.lastPath = routeProps.location.pathname;
          }
          return (
            <Modal
              isOpened={open}
              disableBackdropClick={disableBackdropClick}
              onClose={this.onClose}
              transparent={transparent}
            >
              {inner}
            </Modal>
          );
        }}
      </Route>
    );
  }
}

// $FlowFixMe
ModalRoute.propTypes = Route.propTypes;

export default withRouter(ModalRoute);

//
//                          CLOSING THE MODAL. Vast subject.
//   \
//    '-.__.-'              After multiple iterations, it appears that a
//    /oo |--.--,--,--.     little "customized" behaviour can work better
//    \_.-'._i__i__i_.'     than an abstraction factory that discover more
//          """""""""       and more bugging cases. Here it is:
//
const modalsRoutes = [
  /(.*)\/send$/,
  /(.*)\/receive$/,
  /(.*)\/admin-rules$/,
  /(.*)\/new$/,
  /(.*)\/accounts\/edit\/[0-9]+/,
  /(.*)\/edit\/[0-9]+/,
  /(.*)\/details\/[0-9]+\/.+$/,
];

const usePrevFirst = [
  /.*\/dashboard$/,
  /.*\/tasks$/,
  /.*\/accounts\/view\/[0-9]+$/,
];

function getModalClosePath(p) {
  let match;
  // using find allow to stop parcourir the array when first match
  modalsRoutes.find(regex => {
    match = p.match(regex);
    return match;
  });
  return match ? match[1] : null;
}

function resolveCloseURL(history, lastPath) {
  const { pathname: actualURL } = history.location;
  if (!lastPath) return getModalClosePath(actualURL) || "/";
  if (lastPath && usePrevFirst.find(r => lastPath.match(r))) {
    return lastPath;
  }
  const prevModalClosePath = getModalClosePath(actualURL);
  return prevModalClosePath || lastPath || "/";
}
