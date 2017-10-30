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
  RenderLoading?: (props: PropsWithoutA<Props, A>) => *
};

const defaultOpts = {
  RenderLoading: () => null,
  propsToApiParams: _ => null
};

const neverEnding: Promise<any> = new Promise(() => {});

export default <Props, A: { [_: string]: APISpec }, S>(
  Decorated: In<Props, S>,
  opts: Opts<Props, A>
): Out<Props, A> => {
  const { api, propsToApiParams, RenderLoading } = { ...defaultOpts, ...opts };
  const apiKeys = Object.keys(api);

  class Clazz extends Component<*, *> {
    apiParams: *;

    state: {
      results: ?Object,
      loading: boolean
    } = {
      // local state to keep the results of api queries (only keeping the minimal normalized version here. i.e. the ids)
      results: null,
      // when data gets potentially reloaded, this is a state to track that.
      // TODO: in the future we might move it to the store so if the data gets globally reloaded we can provide this too... it might be a bool per API
      loading: false
    };

    _unmounted = false;

    sync(apiParams: *) {
      const { dispatch } = this.props;
      this.apiParams = apiParams;
      this.setState({ loading: true });
      Promise.all(
        apiKeys.map(key => dispatch(fetchData(api[key], apiParams)))
      ).then(all => {
        if (this._unmounted) return;
        const results = {};
        all.forEach((result, i) => {
          results[apiKeys[i]] = result;
        });
        this.setState({ results, loading: false });
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
      const { results, loading } = this.state;
      if (!results) return <RenderLoading {...props} />;
      const extraProps = {
        fetchData: this.fetchData,
        loading
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
