//@flow
import { Component } from "react";
import PropTypes from "prop-types";
import type { ContextOverridableOpts } from "./connectData";
import type { NetworkF } from "./dataStore";

class RestlayProvider extends Component<{
  network: NetworkF,
  connectDataOptDefaults?: ContextOverridableOpts<*>,
  children: React$Node
}> {
  static childContextTypes = {
    restlayProvider: PropTypes.object.isRequired
  };
  getChildContext() {
    return { restlayProvider: this };
  }
  render() {
    const { children } = this.props;
    return children;
  }
}

export default RestlayProvider;
