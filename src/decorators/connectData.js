//@flow
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import { fetchData } from "../redux/modules/data";
import type { APISpec } from "../data/api-spec";

type FetchData = (api: APISpec, body?: Object) => Promise<*>;
// prettier-ignore
type PropsWithoutA<Props, A> = $Diff<Props, A & {
  fetchData?: FetchData,
  loading?: boolean
}>;
// prettier-ignore
type In<Props, S> = Class<React.Component<Props, S>>;
// prettier-ignore
type Out<Props, A> = Class<React.Component<PropsWithoutA<Props, A>>>;
type Opts<Props, A> = {
  api: A,
  propsToApiParams?: (props: *) => Object,
  RenderLoading?: (props: PropsWithoutA<Props, A>) => *,
  RenderError?: (props: PropsWithoutA<Props, A>, error: Error) => *
};

type State = {
  results: ?Object,
  error: ?Error,
  loading: boolean
};

const defaultOpts = {
  RenderLoading: () => null,
  RenderError: () => null,
  propsToApiParams: _ => null
};

const neverEnding: Promise<any> = new Promise(() => {});

export default <Props, A: { [_: string]: APISpec }, S>(
  Decorated: In<Props, S>,
  opts: Opts<Props, A>
): Out<Props, A> => {
  const { api, propsToApiParams, RenderLoading, RenderError } = {
    ...defaultOpts,
    ...opts
  };
  const apiKeys = Object.keys(api);
  const displayName = `connectData(${Decorated.displayName ||
    Decorated.name ||
    ""})`;

  class Clazz extends Component<*, *> {
    static displayName = displayName;

    apiParams: *;

    state: State = {
      // local state to keep the results of api queries (only keeping the minimal normalized version here. i.e. the ids)
      results: null,
      // when data gets potentially reloaded, this is a state to track that.
      // TODO: in the future we might move it to the store so if the data gets globally reloaded we can provide this too... it might be a bool per API
      loading: false,
      // if any of the api fails, we will have an error
      error: null
    };

    _unmounted = false;

    sync(apiParams: *) {
      const { dispatch } = this.props;
      this.apiParams = apiParams;
      this.setState({ error: null, loading: true });
      Promise.all(apiKeys.map(key => dispatch(fetchData(api[key], apiParams))))
        .then(all => {
          if (this._unmounted) return;
          const results = {};
          all.forEach((result, i) => {
            results[apiKeys[i]] = result;
          });
          this.setState({ results, loading: false });
        })
        .catch(error => {
          if (this._unmounted) return;
          this.setState({
            error,
            loading: false
          });
        });
    }

    /**
     * Perform an API call. body can be provided for POST apis
     * this can also be used to "refresh" data.
     */
    fetchData: FetchData = (api, body) =>
      this.props
        .dispatch(fetchData(api, this.apiParams, body))
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
      const { results, error, loading } = this.state;
      if (error) return <RenderError {...props} error={error} />;
      if (!results) return <RenderLoading {...props} />;
      const extraProps = {
        fetchData: this.fetchData,
        loading
      };
      apiKeys.forEach(key => {
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
