//@flow
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import BlurDialog from "./BlurDialog";
import StaticContainer from "./StaticContainer";

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
  undoAllHistoryOnClickOutside?: boolean,
  component?: *,
  render?: *,
  children?: *
}> {
  static defaultProps = {
    undoAllHistoryOnClickOutside: false
  };
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };
  _unmounted: boolean = false;
  componentWillUnmount() {
    this._unmounted = true;
  }
  historyLengthOnEnter: number = 0;
  close = (undoAllHistory?: boolean = false) => {
    if (this._unmounted) return;
    const move = undoAllHistory
      ? this.historyLengthOnEnter - this.context.router.history.length - 1
      : -1;
    // TODO we probably need to handle case where use just loaded a modal page.
    // in such case we need to replace the history and remove the part before the modal route path
    this.context.router.history.go(move);
  };
  onClose = () => this.close(this.props.undoAllHistoryOnClickOutside);
  lastMatch: ?Object;
  render() {
    const { component, render, children, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return (
      <Route {...rest}>
        {routeProps => {
          if (routeProps.match && !this.lastMatch) {
            this.historyLengthOnEnter = this.context.router.history.length;
          }
          this.lastMatch = routeProps.match;
          const inner = renderInner(routeProps, this.props, {
            close: this.close
          });
          const open = !!routeProps.match;
          return (
            <BlurDialog
              open={open}
              onClose={this.onClose}
              nopadding
            >
              <StaticContainer shouldUpdate={open}>{inner}</StaticContainer>
            </BlurDialog>
          );
        }}
      </Route>
    );
  }
}

ModalRoute.propTypes = Route.propTypes;

export default ModalRoute;
