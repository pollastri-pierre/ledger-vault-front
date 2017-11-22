//@flow
import { connect } from "react-redux";
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

// FIXME how to make this "generic"
import GlobalLoading from "../components/GlobalLoading";

export type RestlayEnvironment = {|
  commitMutation: <In, Res>(m: Mutation<In, Res>) => Promise<Res>,
  fetchQuery: <In, Res>(m: Query<In, Res>) => Promise<Res>,
  forceFetch: () => Promise<void>
  /* IDEA
  isReloadingData: (data: Object) => boolean,
  isOptimisticData: (data: Object) => boolean
  */
|};

type ConnectedProps = {|
  dataStore: Store,
  executeQueryOrMutation: <In, Res>(
    m: Mutation<In, Res> | Query<In, Res>
  ) => Promise<Res>
|};

type InjectedProps = {|
  restlay: RestlayEnvironment,
  reloading: boolean
|};

type ExtractQuery = <Q>(Class<Q>) => Q;
type ExtractQueryResult = <In, Out>(Class<Query<In, Out>>) => Out;
type ExtractQueryIn = <In, Out>(Class<Query<In, Out>>) => In;

// prettier-ignore
type InProps<Props, A> = $Supertype<InjectedProps & $ObjMap<A, ExtractQueryResult> & Props>;
type In<Props, A> =
  | Class<React$Component<InProps<Props, A>, any>>
  | ((props: InProps<Props, A>, ctx: any) => any);
// prettier-ignore
type Out<Props> = Class<React$Component<Props, any>>;

type ClazzProps<Props> = { ...ConnectedProps, ...Props };

type Opts<Props, A> = {
  // an object of { [propName: string]: Class<Query> }
  queries?: A,

  // allow to pass parameters to the api uri function that will be used to generate api URL.
  propsToQueryParams?: (props: Props) => $Values<$ObjMap<A, ExtractQueryIn>>,

  // allow to implement the loading rendering. default is blank
  // prettier-ignore
  RenderLoading?: React$ComponentType<$Shape<{
    restlay: RestlayEnvironment
  } & Props>>,

  // allow to implement the error rendering. default is blank
  // prettier-ignore
  RenderError?: React$ComponentType<$Shape<{
    error: Error,
    restlay: RestlayEnvironment
  } & Props>>,

  // if a cached was defined on the Query, ignore it and make sure to reload the latest data
  forceFetch?: boolean,

  // allow the component to render if the api data was previously loaded
  optimisticRendering?: boolean
};

const defaultOpts = {
  queries: {},
  RenderLoading: GlobalLoading,
  RenderError: () => null,
  propsToQueryParams: _ => ({}),
  forceFetch: false,
  optimisticRendering: false
};

const extractInputProps = <Props>(props: ClazzProps<Props>): Props => {
  const { dataStore, executeQueryOrMutation, ...rest } = props; // eslint-disable-line no-unused-vars
  return rest;
};

const mapStateToProps = (state: Object): { dataStore: Store } => ({
  dataStore: state.data
});

const mapDispatchToProps = dispatch => ({
  executeQueryOrMutation: queryOrMutation =>
    dispatch(executeQueryOrMutation(store => store.data)(queryOrMutation))
});

export default function connectData<
  A: { [key: string]: Class<Query<any, any>> },
  Props: Object
>(Decorated: In<Props, A>, opts?: Opts<Props, A>): Out<Props> {
  type APIProps = $ObjMap<A, ExtractQueryResult>;

  const displayName = `connectData(${Decorated.displayName ||
    Decorated.name ||
    ""})`;

  const allOpts = {
    ...defaultOpts,
    ...opts
  };
  const {
    queries,
    propsToQueryParams,
    optimisticRendering,
    RenderLoading,
    RenderError,
    forceFetch
  } = allOpts;
  const queriesKeys: Array<$Keys<A>> = Object.keys(queries);

  class Clazz extends Component<
    ClazzProps<Props>,
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
    queriesInstances: ?$ObjMap<A, ExtractQuery>;
    _unmounted = false;
    lastCompleteQueriedData: ?APIProps = null;

    sync(
      apiParams: Object,
      forceFetchMode: boolean = false
    ): Array<Promise<*>> {
      const { executeQueryOrMutation, dataStore } = this.props;
      if (this.apiParams !== apiParams || !this.queriesInstances) {
        const instances: $ObjMap<A, ExtractQuery> = {};
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
          if (
            forceFetchMode ||
            forceFetch ||
            !queryCacheIsFresh(dataStore, query)
          ) {
            return executeQueryOrMutation(query);
          }
        })
        .filter(p => p);
      return promises;
    }

    // This "environment" is a restlay prop that will be passed to the component.
    // the idea is to put everything in an object to not pollute props and introduce new things over time
    restlay: RestlayEnvironment = {
      commitMutation: <In, Res>(m: Mutation<In, Res>): Promise<Res> => {
        if (!(m instanceof Mutation)) {
          console.error(m);
          throw new Error(
            "invalid mutation provided in restlay.commitMutation"
          );
        }
        const { executeQueryOrMutation } = this.props;
        return executeQueryOrMutation(m);
      },
      fetchQuery: <In, Res>(query: Query<In, Res>): Promise<Res> => {
        if (!(query instanceof Query)) {
          console.error(query);
          throw new Error("invalid mutation provided in restlay.fetchQuery");
        }
        const { executeQueryOrMutation } = this.props;
        return executeQueryOrMutation(query);
      },
      forceFetch: () => {
        return Promise.all(this.sync(this.apiParams, true)).then(() => {});
      }
    };

    componentWillMount() {
      const promises = this.sync(
        propsToQueryParams(extractInputProps(this.props))
      );
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

    componentWillReceiveProps(props: ClazzProps<Props>) {
      const apiParams = propsToQueryParams(extractInputProps(props));
      if (!isEqual(apiParams, this.apiParams)) {
        this.sync(apiParams);
      }
    }

    componentDidCatch(catchedError: Error) {
      this.setState({ catchedError });
    }

    render() {
      const props = extractInputProps(this.props);
      const { dataStore } = this.props;
      const { queriesInstances, restlay } = this;
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
      for (let key in queriesInstances) {
        const query = queriesInstances[key];
        const cache = getQueryCacheResult(dataStore, query);
        if (cache) {
          results.push({
            result: cache.result,
            key,
            query
          });
        }
      }

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
