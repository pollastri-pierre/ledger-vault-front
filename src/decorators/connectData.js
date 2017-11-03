//@flow
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import { fetchData, apiSpecCacheKey } from "../redux/modules/data";
import type { APISpec } from "../data/api-spec";

type FetchData = (api: APISpec, body?: Object) => Promise<*>;
// prettier-ignore
type PropsWithoutA<Props, A> = $Diff<Props, A & {
    fetchData?: FetchData,
    reloading?: boolean
  }>;
// prettier-ignore
type In<Props, S> = Class<React.Component<Props, S>> | (props: Props)=>*;
// prettier-ignore
type Out<Props, A> = Class<React.Component<PropsWithoutA<Props, A>>>;
type Opts<A> = {
  api: A,
  propsToApiParams?: (props: *) => Object,
  forceFetch?: boolean,
  RenderLoading?: *,
  RenderError?: *
};

type State = {
  results: ?Object,
  error: ?Error,
  loading: boolean
};

const defaultOpts = {
  forceFetch: false,
  RenderLoading: () => null,
  RenderError: () => null,
  propsToApiParams: _ => null // eslint-disable-line no-unused-vars
};

const neverEnding: Promise<any> = new Promise(() => {});

const mapStateToProps = state => ({
  dataStore: state.data
});

const mapDispatchToProps = dispatch => ({
  fetchAPI: (spec, apiParams, body) =>
    dispatch(fetchData(spec, apiParams, body))
});

export default <Props, A: { [_: string]: APISpec }, S>(
  Decorated: In<Props, S>,
  opts: Opts<A>
): Out<Props, A> => {
  const { api, propsToApiParams, RenderLoading, RenderError, forceFetch } = {
    ...defaultOpts,
    ...opts
  };
  const apiKeys = Object.keys(api);
  const displayName = `connectData(${Decorated.displayName ||
    Decorated.name ||
    ""})`;

  for (let k in api) {
    if (!api[k]) {
      console.error("Invalid api provided to " + displayName, api);
    }
  }

  class Clazz extends Component<*, *> {
    static displayName = displayName;

    apiParams: *;

    state: State = {
      // local state to keep the results of api queries (only keeping the minimal normalized version here. i.e. the ids)
      results: null,
      // if any of the api fails, we will have an error
      error: null
    };

    _unmounted = false;

    sync(apiParams: *) {
      const { fetchAPI, dataStore } = this.props;
      this.apiParams = apiParams;

      const asyncData = {};
      const syncData = {};
      apiKeys.forEach(key => {
        const apiSpec = api[key];
        const cacheKey = apiSpecCacheKey(apiSpec, apiParams);
        if (cacheKey && !forceFetch && cacheKey in dataStore.caches) {
          if (!apiSpec.cached) {
            // we still need to refresh the API, it can just happen asyncronously tho
            fetchAPI(apiSpec, apiParams);
          }
          syncData[key] = dataStore.caches[cacheKey];
        } else {
          asyncData[key] = fetchAPI(apiSpec, apiParams);
        }
      });

      const asyncDataKeys = Object.keys(asyncData);
      if (asyncDataKeys.length > 0) {
        this.setState({ error: null });
        Promise.all(asyncDataKeys.map(key => asyncData[key]))
          .then(all => {
            if (this._unmounted) return;
            const results = { ...syncData };
            all.forEach((result, i) => {
              results[asyncDataKeys[i]] = result;
            });
            this.setState({ results });
          })
          .catch(error => {
            if (this._unmounted) return;
            this.setState({
              error
            });
          });
      } else {
        this.setState({ results: syncData });
      }
    }

    /**
     * Perform an API call. body can be provided for POST apis
     * this can also be used to "refresh" data.
     */
    fetchData: FetchData = (api, body) =>
      this.props
        .fetchAPI(api, this.apiParams, body)
        .then(
          result =>
            this._unmounted
              ? neverEnding
              : denormalize(
                  result,
                  api.responseSchema,
                  this.props.dataStore.entities
                )
        );

    componentWillMount() {
      this.sync(propsToApiParams(this.props));
    }

    componentWillUnmount() {
      this._unmounted = true;
    }

    componentWillReceiveProps(props: *) {
      const apiParams = propsToApiParams(props);
      if (!isEqual(apiParams, this.apiParams)) {
        this.sync(apiParams);
      }
    }

    render() {
      const { dataStore, ...props } = this.props;
      const { results, error } = this.state;
      if (error) return <RenderError {...props} error={error} />;
      if (!results) return <RenderLoading {...props} />;
      let reloading = false;
      const apiData = {};
      const { apiParams } = this;
      apiKeys.forEach(key => {
        const apiSpec = api[key];
        apiData[key] = denormalize(
          results[key],
          apiSpec.responseSchema,
          dataStore.entities
        );
        console.log(dataStore.pending, apiSpecCacheKey(apiSpec, apiParams));
        if (dataStore.pending[apiSpecCacheKey(apiSpec, apiParams)]) {
          reloading = true;
        }
      });
      return (
        <Decorated
          {...props}
          {...apiData}
          reloading={reloading}
          fetchData={this.fetchData}
        />
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(Clazz);
};
