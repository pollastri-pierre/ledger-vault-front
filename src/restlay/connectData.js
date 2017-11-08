//@flow
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import {
  fetchDataAction,
  getResultCache,
  cacheIsFresh,
  getResultError,
  isPending
} from "./dataStore";
import type { Store } from "./dataStore";
import type APIQuerySpec from "./APIQuerySpec";
import type APISpec from "./APISpec";

type FetchData = (api: APISpec, body?: Object) => Promise<*>;

// FIXME the flowtypes here still have some issues. trying hard to hunt them all :o

// prettier-ignore
type PropsWithoutA<Props, A> = $Diff<Props, $ObjMap<A, any> & {
    reloading?: boolean,
    fetchData?: FetchData,
    forceFetch?: () => void,
  }> | {| |}/* HACK */;
// prettier-ignore
type In<Props> = React$ComponentType<Props>;
// prettier-ignore
type Out<Props, A> = Class<React$Component<PropsWithoutA<Props, A>>>;
type Opts<A> = {
  // an object of { [propName: string]: APISpec }
  queries?: A,
  // allow to pass parameters to the api uri function that will be used to generate api URL.
  propsToQueryParams?: (props: *) => Object,
  // allow to implement the loading rendering. default is blank
  RenderLoading?: *,
  // allow to implement the error rendering. default is blank
  RenderError?: *,
  // if a cached was defined on the APISpec, ignore it and make sure to reload the latest data
  forceFetch?: boolean,
  // allow the component to render if the api data was previously loaded
  optimisticRendering?: boolean
};

const defaultOpts = {
  queries: {},
  RenderLoading: () => null,
  RenderError: () => null,
  propsToQueryParams: _ => null,
  forceFetch: false,
  optimisticRendering: false
};

const neverEnding: Promise<any> = new Promise(() => {});

const mapStateToProps = (state: Object): { dataStore: Store } => ({
  dataStore: state.data
});

const mapDispatchToProps = dispatch => ({
  fetchAPI: (spec, apiParams, body) =>
    dispatch(fetchDataAction(store => store.data)(spec, apiParams, body))
});

export default <Props, A: { [_: string]: APIQuerySpec }>(
  Decorated: In<Props>,
  opts?: Opts<A> = {}
): Out<Props, A> => {
  type APIProps = $ObjMap<A, any>; // TODO we should be able to infer the response type with this

  const displayName = `connectData(${Decorated.displayName ||
    Decorated.name ||
    ""})`;

  // TOOD drop deprecated
  if (opts.api) {
    //$FlowFixMe
    opts.queries = opts.api;
    console.warn(
      "DEPRECATED opts.api usage on " +
        displayName +
        ". use opts.queries instead"
    );
  }
  if (opts.propsToApiParams) {
    //$FlowFixMe
    opts.propsToQueryParams = opts.propsToApiParams;
    console.warn(
      "DEPRECATED opts.propsToApiParams usage on " +
        displayName +
        ". use opts.propsToQueryParams instead"
    );
  }

  const {
    queries,
    propsToQueryParams,
    optimisticRendering,
    RenderLoading,
    RenderError,
    forceFetch
  } = {
    ...defaultOpts,
    ...opts
  };
  const queriesKeys = Object.keys(queries);

  for (let k in queries) {
    if (!queries[k]) {
      console.error("Invalid queries provided to " + displayName, queries);
    } else if (queries[k].method !== "GET") {
      console.error(
        "Unexpected queries '" +
          k +
          "'. Only GET calls are supported in queries option:",
        queries[k]
      );
    }
  }

  class Clazz extends Component<
    { dataStore: Store, fetchAPI: * } & *,
    {
      catchedError: ?Error,
      initialPending: boolean
    }
  > {
    static displayName = displayName;

    state = {
      // this holds the componentDidCatch errors
      catchedError: null,
      // we need to wait a potential initial sync to not render initially with previous data if optimisticRendering is not asked
      initialPending: false
    };

    apiParams: ?Object;
    _unmounted = false;
    lastCompleteQueriedData: ?APIProps = null;

    sync(apiParams: ?Object): Array<Promise<*>> {
      const { fetchAPI, dataStore } = this.props;
      this.apiParams = apiParams;
      return queriesKeys
        .map(key => {
          const apiSpec = queries[key];
          if (forceFetch || !cacheIsFresh(dataStore, apiSpec, apiParams)) {
            return fetchAPI(apiSpec, apiParams);
          }
        })
        .filter(p => p);
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

    forceFetch = () => this.sync(this.apiParams);

    componentWillMount() {
      const promises = this.sync(propsToQueryParams(this.props));
      if (promises.length > 0) {
        this.setState({ initialPending: true });
        Promise.all(promises).then(() => {
          if (this._unmounted) return;
          this.setState({ initialPending: false });
        });
      }
    }

    componentWillUnmount() {
      this._unmounted = true;
    }

    componentWillReceiveProps(props: *) {
      const apiParams = propsToQueryParams(props);
      if (!isEqual(apiParams, this.apiParams)) {
        this.sync(apiParams);
      }
    }

    componentDidCatch(catchedError: Error) {
      this.setState({ catchedError });
    }

    render() {
      const { dataStore, ...props } = this.props;
      const { apiParams } = this;
      const { catchedError, initialPending } = this.state;
      const error =
        catchedError ||
        queriesKeys.find(key =>
          getResultError(dataStore, queries[key], apiParams)
        ); // take the first API error
      if (error) {
        return (
          <RenderError
            {...props}
            error={error}
            forceFetch={this.forceFetch}
            fetchData={this.fetchData}
          />
        );
      }
      const results = [];
      queriesKeys.forEach(key => {
        const apiSpec = queries[key];
        const cache = getResultCache(dataStore, apiSpec, apiParams);
        if (!cache) return;
        results.push({
          result: cache.result,
          key,
          apiSpec
        });
      });

      const havePendings =
        initialPending ||
        results.some(r => isPending(dataStore, r.apiSpec, apiParams));

      let queriedData: ?APIProps = this.lastCompleteQueriedData;

      if (results.length !== queriesKeys.length) {
        // one of the result is missing, we can't render yet so we keep rendering the old queried data if we can
        // we keep rending the old lastCompleteQueriedData to "freeze" the rendering until the new data is ready instead of reloading
        //queriedData = this.lastCompleteQueriedData;
      } else if (!havePendings || optimisticRendering) {
        // all results are available, we will make the api props data object
        const data: APIProps = {};
        results.forEach(({ apiSpec, result, key }) => {
          data[key] = denormalize(
            result,
            apiSpec.responseSchema,
            dataStore.entities
          );
        });
        queriedData = data;
        if (!havePendings) {
          this.lastCompleteQueriedData = queriedData; // save only when we reach no pendings
        }
      }

      if (!queriedData) {
        // in case there were not a complete api yet, it means we are still loading
        return <RenderLoading {...props} />;
      }

      return (
        <Decorated
          {...props}
          {...queriedData}
          reloading={havePendings}
          forceFetch={this.forceFetch}
          fetchData={this.fetchData}
        />
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(Clazz);
};
