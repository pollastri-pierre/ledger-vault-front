// TODO: put back the flow validation when we have time. actually it produce
// a million errors.
//
// @/f/l/o/w/

// then, remove those rules
/* eslint-disable flowtype/no-types-missing-file-annotation */
/* eslint-disable no-undef */

import { Component } from "react";
import PropTypes from "prop-types";
import type Query from "./Query";
import type ConnectionQuery from "./ConnectionQuery";

export type NetworkF = <T>(
  uri: string,
  method: string,
  body: ?(Object | Array<Object>)
) => Promise<T>;

class RestlayProvider extends Component<{
  network: NetworkF,
  children: React$Node
}> {
  static childContextTypes = {
    restlayProvider: PropTypes.object.isRequired
  };

  getChildContext() {
    return { restlayProvider: this };
  }

  // these are internal objects used by dataStore

  _pendingQueries: { [_: string]: Promise<any> } = {};

  getPendingQuery = <Out>(
    query: Query<any, Out> | ConnectionQuery<any, any>
  ): Promise<Out> => this._pendingQueries[query.getCacheKey()];

  setPendingQuery = <Out>(
    query: Query<any, Out> | ConnectionQuery<any, any>,
    promise: Promise<Out>
  ): void => {
    this._pendingQueries[query.getCacheKey()] = promise;
  };

  removePendingQuery = <Out>(
    query: Query<any, Out> | ConnectionQuery<any, any>
  ): void => {
    delete this._pendingQueries[query.getCacheKey()];
  };

  network = (...props: *) => this.props.network(...props);

  // ///////////////

  render() {
    const { children } = this.props;
    return children;
  }
}

export default RestlayProvider;
