//@flow
import { connect } from "react-redux";
import invariant from "invariant";
import React, { Component } from "react";
import PropTypes from "prop-types";
import shallowEqual from "fbjs/lib/shallowEqual";
import isEqual from "lodash/isEqual";
import {
  executeQueryOrMutation,
  getQueryCacheResult,
  queryCacheIsFresh
} from "./dataStore";
import type { Store } from "./dataStore";
import Query from "./Query";
import Mutation from "./Mutation";
import type RestlayProvider from "./RestlayProvider";

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
  dispatch: Function
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

export type ContextOverridableOpts<Props> = {
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
  } & Props>>
};

type Opts<Props, A> = ContextOverridableOpts<Props> & {
  // an object of { [propName: string]: Class<Query> }
  queries?: A,

  // allow to pass parameters to the api uri function that will be used to generate api URL.
  propsToQueryParams?: (props: Props) => $Values<$ObjMap<A, ExtractQueryIn>>,

  // if a cached was defined on the Query, ignore it and make sure to reload the latest data
  forceFetch?: boolean,

  // allow the component to render if the api data was previously loaded in cache
  optimisticRendering?: boolean,

  // when new props changes the query params / new data refresh, don't render anything until it loads
  freezeTransition?: boolean,

  // when new data is reloading, always render again RenderLoading
  renderLoadingInTransition?: boolean
};

const defaultOpts = {
  queries: {},
  RenderLoading: () => null,
  RenderError: () => null,
  propsToQueryParams: _ => ({}),
  forceFetch: false,
  optimisticRendering: false,
  freezeTransition: false,
  renderLoadingInTransition: false
};

const extractInputProps = <Props>(props: ClazzProps<Props>): Props => {
  const { dataStore, dispatch, ...rest } = props; // eslint-disable-line no-unused-vars
  return rest;
};

const mapStateToProps = (state: Object): { dataStore: Store } => ({
  dataStore: state.data
});

export default function connectData<
  A: { [key: string]: Class<Query<any, any>> },
  Props: Object
>(Decorated: In<Props, A>, opts?: Opts<Props, A>): Out<Props> {
  type APIProps = $ObjMap<A, ExtractQueryResult>;

  const displayName = `connectData(${Decorated.displayName ||
    Decorated.name ||
    ""})`;

  // options that are not overridable by restlayProvider
  const {
    queries,
    propsToQueryParams,
    optimisticRendering,
    renderLoadingInTransition,
    freezeTransition,
    forceFetch
  } = {
    ...defaultOpts,
    ...opts
  };
  const queriesKeys: Array<$Keys<A>> = Object.keys(queries);

  type State = {
    catchedError: ?Error,
    apiError: ?Error,
    pending: boolean,
    data: ?APIProps
  };

  const withoutPending = ({ pending, ...rest }: State) => rest; // eslint-disable-line no-unused-vars

  class Clazz extends Component<ClazzProps<Props>, State> {
    context: {
      restlayProvider: RestlayProvider
    };

    static displayName = displayName;
    static contextTypes = {
      restlayProvider: PropTypes.object.isRequired
    };

    state = {
      // this holds the componentDidCatch errors
      catchedError: null,
      apiError: null,
      // we need to wait a potential initial sync to not render initially with previous data if optimisticRendering is not asked
      pending: false,
      data: null
    };

    _options = {
      ...defaultOpts,
      ...this.context.restlayProvider.props.connectDataOptDefaults,
      ...opts
    };

    getOptions() {
      return this._options;
    }

    apiParams: ?Object = null;
    queriesInstances: ?$ObjMap<A, ExtractQuery>;
    _unmounted = false;

    executeQueryF = executeQueryOrMutation(this.context.restlayProvider);

    execute<In, Out>(
      queryOrMutation: Query<In, Out> | Mutation<In, Out>
    ): Promise<Out> {
      return this.props.dispatch(this.executeQueryF(queryOrMutation));
    }

    commitMutation = <In, Res>(m: Mutation<In, Res>): Promise<Res> => {
      return this.execute(m);
    };

    fetchQuery = <In, Res>(query: Query<In, Res>): Promise<Res> => {
      return this.execute(query);
    };

    updateQueryInstances(apiParams: Object) {
      const instances: $ObjMap<A, ExtractQuery> = {};
      queriesKeys.forEach(key => {
        const Q = queries[key];
        const query: Query<*, *> = new Q(apiParams);
        instances[key] = query;
      });
      this.queriesInstances = instances;
      this.apiParams = apiParams;
    }

    syncAPI(
      apiParams: Object,
      forceFetchMode: boolean = false
    ): Array<Promise<*>> {
      const { dataStore } = this.props;
      if (this.apiParams !== apiParams || !this.queriesInstances) {
        this.updateQueryInstances(apiParams);
      }
      const queriesInstances = this.queriesInstances;
      invariant(queriesInstances, "queriesInstances must be defined");
      // $FlowFixMe filter() don't seem to be flowtyped correctly
      const promises: Array<Promise<*>> = queriesKeys
        .map(key => {
          const query = queriesInstances[key];
          if (
            forceFetchMode ||
            forceFetch ||
            !queryCacheIsFresh(dataStore, query)
          ) {
            return this.fetchQuery(query);
          }
        })
        .filter(p => p);
      return promises;
    }

    syncAPI_id = 0;

    syncProps(
      props: ClazzProps<Props>,
      statePatch: $Shape<State> = {},
      forceFetchMode: boolean = false
    ): Promise<*> {
      // FIXME can we simplify the code?
      const state = { ...this.state, ...statePatch };
      const { dataStore } = props;
      let p: ?Promise<*>;

      const apiParams = propsToQueryParams(extractInputProps(props));
      if (
        !this.apiParams ||
        !isEqual(apiParams, this.apiParams) ||
        forceFetchMode
      ) {
        const syncId = ++this.syncAPI_id;
        const promises = this.syncAPI(apiParams, forceFetchMode);
        state.pending = true;
        state.apiError = null;
        if (promises.length > 0) {
          p = Promise.all(promises).then(
            () => {
              if (this._unmounted || syncId !== this.syncAPI_id) return;
              // we need to sync again to make sure data is in sync.
              // FIXME ^ really? after all tests are implemented, check again if we can't just do a setState with the patch
              // NB we patch with a subset of state because local state variable might be outdated
              this.syncProps(this.props, { apiError: null, pending: false });
            },
            apiError => {
              if (this._unmounted || syncId !== this.syncAPI_id) return;
              this.setState({ apiError, pending: false });
            }
          );
        }
      }

      const { queriesInstances } = this;
      const results = [];
      for (let key in queriesInstances) {
        const query = queriesInstances[key];
        const cache = getQueryCacheResult(dataStore, query);
        if (cache) {
          const { result } = cache;
          results.push({ result, key, query });
        }
      }

      if (results.length === queriesKeys.length) {
        if (!state.pending || optimisticRendering) {
          const newData: APIProps = {};
          let nbOfChanges = 0;
          results.forEach(({ query, result, key }) => {
            let item = query.getResponse(result, dataStore);
            // FIXME PERF: isEqual on data should not be required if we improve normalizr to keep references
            if (state.data && isEqual(item, state.data[key])) {
              // keep previous reference if deep equals
              item = state.data[key];
            } else {
              nbOfChanges++;
            }
            newData[key] = item;
          });
          if (nbOfChanges > 0) {
            // only set newData if it's actually new data^^
            state.catchedError = null;
            state.apiError = null;
            state.data = newData;
          }
        }
      }

      this.setState(state);
      return p || Promise.resolve();
    }

    componentWillMount() {
      this.syncProps(this.props);
    }

    componentWillUnmount() {
      this._unmounted = true;
    }

    componentWillReceiveProps(props: ClazzProps<Props>) {
      this.syncProps(props);
    }

    componentDidCatch(catchedError: Error) {
      this.setState({ catchedError });
    }

    shouldComponentUpdate(props: ClazzProps<Props>, state: State) {
      if (freezeTransition) {
        if (state.pending) return false;
      } else {
        if (state.pending !== this.state.pending) {
          return true;
        }
      }
      return (
        !shallowEqual(
          extractInputProps(this.props),
          extractInputProps(props)
        ) || !shallowEqual(withoutPending(this.state), withoutPending(state))
      );
    }

    // This "environment" is a restlay prop that will be passed to the component.
    // the idea is to put everything in an object to not pollute props and introduce new things over time
    restlay: RestlayEnvironment = {
      commitMutation: this.commitMutation,
      fetchQuery: this.fetchQuery,
      forceFetch: () => this.syncProps(this.props, {}, true).then(() => {})
    };

    render() {
      const { restlay } = this;
      const { data, apiError, catchedError, pending } = this.state;
      const props = extractInputProps(this.props);
      const error = catchedError || apiError;
      const { RenderError, RenderLoading } = this.getOptions();
      if (error) {
        // there is an error
        return <RenderError {...props} error={error} restlay={restlay} />;
      }
      if (
        (!data && queriesKeys.length > 0) || // there is no data yet (and we expect at least one data)
        (pending && renderLoadingInTransition) // it is reloading and we want to render loading again
      ) {
        return <RenderLoading {...props} restlay={restlay} />;
      }
      // all data is here and ready to render the Decorated component
      return (
        <Decorated {...props} {...data} reloading={pending} restlay={restlay} />
      );
    }
  }

  return connect(mapStateToProps)(Clazz);
}
