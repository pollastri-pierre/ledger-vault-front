// @flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import Modal from "components/base/Modal";

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
}> {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired,
    }),
  };

  _unmounted: boolean = false;

  componentWillUnmount() {
    this._unmounted = true;
  }

  onClose = () => {
    if (this._unmounted) return;
    // assume we need to go back to a 3-length history
    // /{orga}/{role}/{page}
    const { pathname } = this.context.router.history.location;
    const url = pathname
      .split("/")
      // 4 because of leading /
      .slice(0, 4)
      .join("/");
    this.context.router.history.push(url);
  };

  lastMatch: ?Object;

  render() {
    const {
      component, // eslint-disable-line no-unused-vars
      render, // eslint-disable-line no-unused-vars
      children, // eslint-disable-line no-unused-vars
      disableBackdropClick,
      transparent,
      ...rest
    } = this.props;
    return (
      <Route {...rest}>
        {routeProps => {
          this.lastMatch = routeProps.match;
          const inner = renderInner(routeProps, this.props, {
            close: this.onClose,
          });
          const open = !!routeProps.match;
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

export default ModalRoute;
