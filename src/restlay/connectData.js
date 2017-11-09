//@flow
import { connect } from "react-redux";
import { denormalize } from "normalizr";
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import {
  executeQueryOrMutation,
  getQueryCacheResult,
  queryCacheIsFresh,
  getQueryError,
  queryIsPending
} from "./dataStore";
import type { Store } from "./dataStore";
import Query from "./Query";
import Mutation from "./Mutation";

export type RestlayEnvironment = {
  commitMutation: <In, Res>(m: Mutation<In, Res>) => Promise<Res>,
  refreshQuery: <In, Res>(m: Query<In, Res>) => Promise<Res>,
  forceFetch: () => void
  /* IDEA
  isReloadingData: (data: Object) => boolean,
  isOptimisticData: (data: Object) => boolean
  */
};

// prettier-ignore
type In<Props> = React$ComponentType<Props>;
// prettier-ignore
type Out<Props, A> = Class<React$Component<*, *>>; // FIXME figure out flowtype of the output component. a mixing of $Diff, $ObjMap, $Shape magics?
type Opts<A> = {
  // an object of { [propName: string]: Class<Query> }
  queries?: A,
  // allow to pass parameters to the api uri function that will be used to generate api URL.
  propsToQueryParams?: (props: *) => Object,
  // allow to implement the loading rendering. default is blank
  RenderLoading?: *,
  // allow to implement the error rendering. default is blank
  RenderError?: *,
  // if a cached was defined on the Query, ignore it and make sure to reload the latest data
  forceFetch?: boolean,
  // allow the component to render if the api data was previously loaded
  optimisticRendering?: boolean
};

const defaultOpts = {
  queries: {},
  RenderLoading: () => null,
  RenderError: () => null,
  propsToQueryParams: _ => ({}),
  forceFetch: false,
  optimisticRendering: false
};

const neverEnding: Promise<any> = new Promise(() => {});

const mapStateToProps = (state: Object): { dataStore: Store } => ({
  dataStore: state.data
});

const mapDispatchToProps = dispatch => ({
  executeQueryOrMutation: queryOrMutation =>
    dispatch(executeQueryOrMutation(store => store.data)(queryOrMutation))
});

function connectData<A: { [_: string]: Class<Query<any, any>> }, Props>(
  Decorated: In<Props>,
  opts?: Opts<A>
): Out<Props, A> {
  type APIProps = $ObjMap<A, any>; // TODO we should be able to infer the response type with this

  const displayName = `connectData(${Decorated.displayName ||
    Decorated.name ||
    ""})`;

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

  class Clazz extends Component<
    {
      dataStore: Store,
      executeQueryOrMutation: <In, Res>(
        Mutation<In, Res> | Query<In, Res>
      ) => Promise<Res>
    } & *,
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

    apiParams: Object = {};
    queriesInstances: ?{ [_: string]: Query<*, *> };
    _unmounted = false;
    lastCompleteQueriedData: ?APIProps = null;

    sync(apiParams: Object): Array<Promise<*>> {
      const { executeQueryOrMutation, dataStore } = this.props;
      if (this.apiParams !== apiParams || !this.queriesInstances) {
        const instances = {};
        queriesKeys.forEach(key => {
          const Q = queries[key];
          const query: Query<*, *> = new Q(apiParams);
          instances[key] = query;
        });
        this.queriesInstances = instances;
        this.apiParams = apiParams;
      }
      const queriesInstances = this.queriesInstances;
      // $FlowFixMe filter() don't seem to be flowtyped correctly
      const promises: Array<Promise<*>> = queriesKeys
        .map(key => {
          const query = queriesInstances[key];
          if (forceFetch || !queryCacheIsFresh(dataStore, query)) {
            return executeQueryOrMutation(query);
          }
        })
        .filter(p => p);
      return promises;
    }

    // This "environment" is a restlay prop that will be passed to the component.
    // the idea is to put everything in an object to not pollute props and introduce new things over time
    restlay: RestlayEnvironment = {
      commitMutation: m => {
        if (!(m instanceof Mutation)) {
          console.error(m);
          throw new Error(
            "invalid mutation provided in restlay.commitMutation"
          );
        }
        const { executeQueryOrMutation } = this.props;
        return executeQueryOrMutation(m);
      },
      refreshQuery: query => {
        if (!(query instanceof Query)) {
          console.error(query);
          throw new Error("invalid mutation provided in restlay.refreshQuery");
        }
        const { executeQueryOrMutation } = this.props;
        return executeQueryOrMutation(query);
      },
      forceFetch: () => {
        this.sync(this.apiParams);
      }
    };

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
      const { apiParams, queriesInstances, restlay } = this;
      const { catchedError, initialPending } = this.state;
      if (!queriesInstances) {
        // this should never happen
        throw new Error("queriesInstances not set in connectData");
      }
      const error =
        catchedError ||
        queriesKeys.find(key =>
          getQueryError(dataStore, queriesInstances[key])
        ); // take the first API error
      if (error) {
        return <RenderError {...props} error={error} restlay={restlay} />;
      }
      const results = [];
      queriesKeys.forEach(key => {
        const query = queriesInstances[key];
        const cache = getQueryCacheResult(dataStore, query);
        if (!cache) return;
        results.push({
          result: cache.result,
          key,
          query
        });
      });

      const havePendings =
        initialPending || results.some(r => queryIsPending(dataStore, r.query));

      let queriedData: ?APIProps = this.lastCompleteQueriedData;

      if (results.length !== queriesKeys.length) {
        // one of the result is missing, we can't render yet so we keep rendering the old queried data if we can
        // we keep rending the old lastCompleteQueriedData to "freeze" the rendering until the new data is ready instead of reloading
        //queriedData = this.lastCompleteQueriedData;
      } else if (!havePendings || optimisticRendering) {
        // all results are available, we will make the api props data object
        const data: APIProps = {};
        results.forEach(({ query, result, key }) => {
          data[key] = query.getResponse(result, dataStore);
        });
        queriedData = data;
        if (!havePendings) {
          this.lastCompleteQueriedData = queriedData; // save only when we reach no pendings
        }
      }

      if (!queriedData) {
        // in case there were not a complete api yet, it means we are still loading
        return <RenderLoading {...props} restlay={restlay} />;
      }

      return (
        <Decorated
          {...props}
          {...queriedData}
          reloading={havePendings}
          restlay={restlay}
        />
      );
    }
  }

  return connect(mapStateToProps, mapDispatchToProps)(Clazz);
}

export default connectData;
