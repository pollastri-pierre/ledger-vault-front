//@flow
import { connect } from "react-redux";
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
  const { queries, propsToQueryParams, optimisticRendering, forceFetch } = {
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
      if (!queriesInstances) throw new Error("no queriesInstances in sync !?");
      // $FlowFixMe filter() don't seem to be flowtyped correctly
      const promises: Array<Promise<*>> = queriesKeys
        .map(key => {
          const query = queriesInstances[key];
          if (
            forceFetchMode ||
            forceFetch ||
            !queryCacheIsFresh(dataStore, query)
          ) {
            return this.execute(query);
          }
        })
        .filter(p => p);
      return promises;
    }

    syncAPI_id = 0;

    syncProps(
      props: ClazzProps<Props>,
      forceFetchMode: boolean = false
    ): Promise<*> {
      // FIXME can we simplify the code?

      let { pending, data } = this.state;
      const { queriesInstances } = this;
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
        if (promises.length > 0) {
          pending = true;
          if (!this.state.pending) this.setState({ pending });
          p = Promise.all(promises).then(
            () => {
              if (this._unmounted || syncId !== this.syncAPI_id) return;
              this.setState({ pending: false }, () => {
                this.syncProps(this.props); // we need to sync again to make sure data is in sync
              });
            },
            apiError => {
              if (this._unmounted || syncId !== this.syncAPI_id) return;
              this.setState({ apiError, pending: false });
            }
          );
        }
      }

      const results = [];
      for (let key in queriesInstances) {
        const query = queriesInstances[key];
        const cache = getQueryCacheResult(dataStore, query);
        if (cache) {
          const { result } = cache;
          results.push({
            result,
            key,
            query
          });
        }
      }

      if (results.length === queriesKeys.length) {
        if (!pending || optimisticRendering) {
          const newData: APIProps = {};
          let nbOfChanges = 0;
          results.forEach(({ query, result, key }) => {
            let item = query.getResponse(result, dataStore);
            if (data && isEqual(item, data[key])) {
              // keep previous reference if deep equals
              item = data[key];
            } else {
              nbOfChanges++;
            }
            newData[key] = item;
          });
          if (nbOfChanges > 0) {
            // only set newData if it's actually new data^^
            this.setState({ data: newData });
          }
        }
      }

      return p || Promise.resolve();
    }

    execute<In, Out>(
      queryOrMutation: Query<In, Out> | Mutation<In, Out>
    ): Promise<Out> {
      return this.props.dispatch(
        executeQueryOrMutation(this.context.restlayProvider.props.network)(
          queryOrMutation
        )
      );
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
        return this.execute(m);
      },
      fetchQuery: <In, Res>(query: Query<In, Res>): Promise<Res> => {
        if (!(query instanceof Query)) {
          console.error(query);
          throw new Error("invalid mutation provided in restlay.fetchQuery");
        }
        return this.execute(query);
      },
      forceFetch: () => this.syncProps(this.props, true).then(() => {})
    };

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
      return (
        !shallowEqual(
          extractInputProps(this.props),
          extractInputProps(props)
        ) || !shallowEqual(this.state, state)
      );
    }

    render() {
      const { restlay } = this;
      const { data, apiError, catchedError, pending } = this.state;
      const props = extractInputProps(this.props);
      const error = catchedError || apiError;
      const { RenderError, RenderLoading } = this.getOptions();
      if (error) {
        return <RenderError {...props} error={error} restlay={restlay} />;
      }
      if (!data) {
        return <RenderLoading {...props} restlay={restlay} />;
      }
      return (
        <Decorated {...props} {...data} reloading={pending} restlay={restlay} />
      );
    }
  }

  return connect(mapStateToProps)(Clazz);
}
