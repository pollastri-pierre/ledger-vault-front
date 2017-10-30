//@flow
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import { fetchData } from "../redux/modules/data";
import SpinnerCard from "../components/spinners/SpinnerCard";
import type { APISpec } from "../data/api-spec";

type Opts = {
  // TODO multi api. we need to pull multiple endpoints sometimes
  api: { [_: string]: APISpec },
  propsToApiParams?: (props: *) => Object,
  RenderLoading?: (props: Object) => *
  // TODO RenderError
};

const defaultOpts = {
  RenderLoading: SpinnerCard,
  propsToApiParams: _ => null
};

// TODO it would be great to infer the type of props the Decorated will receives <3

export default (Decorated: *, opts: Opts) => {
  const { api, propsToApiParams, RenderLoading } = { ...defaultOpts, ...opts };
  const apiKeys = Object.keys(api);

  class Clazz extends Component<*, *> {
    apiParams: *;

    state: {
      results: ?Object
    } = {
      // local state to keep the results of api queries (only keeping the minimal normalized version here. i.e. the ids)
      results: null
    };

    sync(apiParams: *) {
      const { dispatch } = this.props;
      this.apiParams = apiParams;
      Promise.all(
        apiKeys.map(key => dispatch(fetchData(api[key], apiParams)))
      ).then(all => {
        const results = {};
        all.forEach((result, i) => {
          results[apiKeys[i]] = result;
        });
        this.setState({ results });
      });
    }

    forceUpdate = () => this.sync(this.apiParams);

    componentWillMount() {
      this.sync(propsToApiParams(this.props));
    }

    componentWillReceiveProps(props: *) {
      const apiParams = propsToApiParams(props);
      if (!isEqual(apiParams, this.apiParams)) {
        this.sync(apiParams);
      }
    }

    render() {
      const { dataStore, ...props } = this.props;
      const { results } = this.state;
      if (!results) return <RenderLoading {...props} />;
      const extraProps = {
        forceUpdate: this.forceUpdate
      };
      apiKeys.map(key => {
        const data = denormalize(
          results[key],
          api[key].responseSchema,
          dataStore.entities
        );
        extraProps[key] = data;
      });
      return <Decorated {...props} {...extraProps} />;
    }
  }

  return connect(({ data }) => ({ dataStore: data }))(Clazz);
};
