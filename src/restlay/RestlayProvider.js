//@flow
import { Component } from "react";
import PropTypes from "prop-types";
import type { ContextOverridableOpts } from "./connectData";

export type NetworkF = <T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>)
) => Promise<T>;

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

  // these are internal objects used by dataStore

  globalPromiseCache: { [_: string]: Promise<any> } = {};
  network = (...props: *) => this.props.network(...props);

  /////////////////

  render() {
    const { children } = this.props;
    return children;
  }
}

export default RestlayProvider;
