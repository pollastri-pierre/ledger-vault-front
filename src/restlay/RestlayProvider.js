// TODO: put back the flow validation when we have time. actually it produce
// a million errors.
//
// @/f/l/o/w/

// then, remove those rules
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable no-undef */

import React, { Component } from "react";
import type Query from "./Query";
import type ConnectionQuery from "./ConnectionQuery";

export type NetworkF = <T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>),
) => Promise<T>;

export const RestlayContext: React$Context<?RestlayProvider> = React.createContext(
  null,
);

class RestlayProvider extends Component<{
  network: NetworkF,
  children: React$Node,
}> {
  // these are internal objects used by dataStore

  _pendingQueries: { [_: string]: Promise<any> } = {};

  getPendingQuery = <Out>(
    query: Query<any, Out> | ConnectionQuery<any, any>,
  ): Promise<Out> => this._pendingQueries[query.getCacheKey()];

  setPendingQuery = <Out>(
    query: Query<any, Out> | ConnectionQuery<any, any>,
    promise: Promise<Out>,
  ): void => {
    this._pendingQueries[query.getCacheKey()] = promise;
  };

  removePendingQuery = <Out>(
    query: Query<any, Out> | ConnectionQuery<any, any>,
  ): void => {
    delete this._pendingQueries[query.getCacheKey()];
  };

  network = (...props: *) => this.props.network(...props);

  // ///////////////

  render() {
    const { children } = this.props;
    return (
      <RestlayContext.Provider value={this}>{children}</RestlayContext.Provider>
    );
  }
}

export const withRestlayContext = (Comp: React$ComponentType<*>) => p => (
  <RestlayContext.Consumer>
    {restlayProvider => <Comp restlayProvider={restlayProvider} {...p} />}
  </RestlayContext.Consumer>
);

export default RestlayProvider;
