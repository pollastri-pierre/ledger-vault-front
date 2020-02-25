// @flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Route } from "react-router-dom";
import type { MemoryHistory } from "history";

import Modal from "components/base/Modal";
import { getModalClosePath } from "utils/modal";
import { UserContext } from "components/UserContextProvider";

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

  static contextType = UserContext;

  componentWillUnmount() {
    this._unmounted = true;
  }

  lastPath: ?string = null;

  lastSearch: ?string = null;

  onClose = () => {
    if (this._unmounted) return;
    // this.props.resetRequest();
    const { history } = this.props;
    history.push({
      pathname: resolveCloseURL(history, this.lastPath, this.context),
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
              history={history}
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

const usePrevFirst = [
  /.*\/dashboard$/,
  /.*\/tasks$/,
  /.*\/accounts\/view\/[0-9]+$/,
];

function resolveCloseURL(history, lastPath, me) {
  const { pathname: actualURL } = history.location;
  if (!lastPath) return getModalClosePath(actualURL, me) || "/";
  if (lastPath && usePrevFirst.find(r => lastPath.match(r))) {
    return lastPath;
  }
  const prevModalClosePath = getModalClosePath(actualURL, me);
  return prevModalClosePath || lastPath || "/";
}
