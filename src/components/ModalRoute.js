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

class ModalRoute extends Component<*> {
  static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.object.isRequired
    })
  };
  _unmounted = false;
  componentWillUnmount() {
    this._unmounted = true;
  }
  close = () => {
    if (this._unmounted) return;
    this.context.router.history.goBack();
  };
  render() {
    const { component, render, children, ...rest } = this.props; // eslint-disable-line no-unused-vars
    return (
      <Route {...rest}>
        {routeProps => {
          const inner = renderInner(routeProps, this.props, {
            close: this.close
          });
          const open = !!routeProps.match;
          return (
            <BlurDialog open={open} onRequestClose={this.close} nopadding>
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
