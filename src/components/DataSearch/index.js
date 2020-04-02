// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import { denormalize } from "normalizr-gre";
import qs from "query-string";
import omit from "lodash/omit";
import type { ObjectParameters } from "query-string";
import type { MemoryHistory } from "history";

import { getPendingQueryResult, queryCacheIsFresh } from "restlay/dataStore";
import Mutation from "restlay/Mutation";
import Spinner from "components/base/Spinner";
import colors, { darken } from "shared/colors";
import { minWait } from "utils/promise";
import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import type { TableDefinition } from "components/Table/types";
import ConnectionQuery from "restlay/ConnectionQuery";
import TriggerErrorNotification from "components/TriggerErrorNotification";
import Box from "components/base/Box";
import Paginator from "components/base/Paginator";

const DEFAULT_PAGE_SIZE = 30;

type Props<T> = {
  TableComponent: React$ComponentType<*>,
  FilterComponent: React$ComponentType<*>,
  HeaderComponent?: React$ComponentType<*>,
  ActionComponent?: React$ComponentType<*>,
  customTableDef?: TableDefinition,
  restlay: RestlayEnvironment,
  Query: (*) => ConnectionQuery<*, *>,
  extraProps: Object,
  queryExtraProps?: Object,
  onQueryParamsChange?: ObjectParameters => void,
  onRowClick?: T => void,
  listenMutations?: Mutation<any, any>[],
  history?: MemoryHistory,
};

type Status = "initial" | "idle" | "loading" | "error";

type State = {
  status: Status,
  queryParams: ObjectParameters,
  response: ?Object,
  error: ?Error,
};

const BLACKLIST_PARAMS = ["requestID"];

class DataSearch extends PureComponent<Props<*>, State> {
  constructor(props) {
    super(props);
    const { history, Query } = this.props;
    const queryParams = omit(
      history ? qs.parse(window.location.search) : {},
      BLACKLIST_PARAMS,
    );

    // if no pageSize is given in the url,
    // we take the one defined in the Query ( by building a fake query to have the instance )
    // or we give a default one as a fallback

    if (!queryParams.pageSize) {
      const fakeQuery = new Query(queryParams);
      queryParams.pageSize = String(fakeQuery.pageSize || DEFAULT_PAGE_SIZE);
    }

    this.state = {
      response: null,
      status: "initial",
      // $FlowFixMe
      queryParams,
      error: null,
    };
  }

  componentDidMount() {
    const { listenMutations, restlay } = this.props;

    this.fetch();
    if (listenMutations) {
      restlay.subscribeMutations(listenMutations, this.fetch);
    }
  }

  componentDidUpdate(prevProps: Props<*>, prevState: State) {
    if (prevState.queryParams !== this.state.queryParams) {
      this.fetch();
    }
  }

  componentWillUnmount() {
    const { listenMutations, restlay } = this.props;

    if (listenMutations) {
      restlay.unsubscribeMutations(listenMutations, this.fetch);
    }
    this._isUnmounted = true;
  }

  _requestId = 0;

  _isUnmounted = false;

  fetch = async () => {
    const { Query, restlay, queryExtraProps } = this.props;
    const { queryParams } = this.state;

    const _requestId = ++this._requestId;

    this.setState({ status: "loading" });

    let patch = null;

    try {
      const query = new Query({ ...queryParams, ...(queryExtraProps || {}) });
      const dataStore = restlay.getStore();
      const dataFromCache =
        queryCacheIsFresh(dataStore, query) &&
        getPendingQueryResult(dataStore, query);

      let response;
      if (!dataFromCache) {
        response = await minWait(restlay.fetchQuery(query), 500);
      } else {
        const r = denormalize(
          dataFromCache.result,
          query.getResponseSchema(),
          dataStore.entities,
        );

        response = await Promise.resolve(r);
      }
      patch = {
        status: "idle",
        response,
        error: null,
      };
    } catch (error) {
      patch = { status: "error", error };
    } finally {
      if (_requestId === this._requestId && !this._isUnmounted) {
        this.setState(patch);
      }
    }
  };

  handleUpdateQueryParams = (queryParams: ObjectParameters) => {
    const { onQueryParamsChange, history } = this.props;
    this.setState({ queryParams });
    if (onQueryParamsChange) {
      onQueryParamsChange(queryParams);
    }
    if (history) {
      history.push({ search: qs.stringify(queryParams) });
    }
  };

  handleChangeSort = (orderBy: string, order: ?string) => {
    const { queryParams } = this.state;
    if (!order) {
      this.handleUpdateQueryParams(omit(queryParams, ["order", "orderBy"]));
    } else {
      this.handleUpdateQueryParams({ ...queryParams, orderBy, order });
    }
  };

  handleChangePage = (page: number) => {
    const { queryParams } = this.state;

    if (!queryParams.page || parseInt(queryParams.page, 10) !== page) {
      this.handleUpdateQueryParams({
        ...queryParams,
        page,
      });
    }
  };

  render() {
    const {
      TableComponent,
      FilterComponent,
      HeaderComponent,
      ActionComponent,
      customTableDef,
      onRowClick,
      extraProps,
    } = this.props;

    const { status, response, error, queryParams } = this.state;
    const data = resolveData(response);
    const isFirstQuery = this._requestId <= 1;
    const isLoading = status === "loading";

    const Loading =
      isFirstQuery || (!data.length && isLoading) ? InitialLoading : null;

    const showTable = !(isFirstQuery && (status === "initial" || isLoading));

    const count = resolveCount(data, response);
    const page = (queryParams.page && parseInt(queryParams.page, 10)) || 1;
    const showPaginator = count > data.length;

    const filters = (
      <FiltersWrapper>
        {error && <TriggerErrorNotification error={error} />}
        {HeaderComponent && <HeaderComponent />}
        <Box horizontal justify="space-between">
          <FilterComponent
            withNoAction={!ActionComponent}
            onChange={this.handleUpdateQueryParams}
            queryParams={queryParams}
            nbResults={status === "idle" || status === "error" ? count : null}
            paginator={
              showPaginator ? (
                <Paginator
                  page={page}
                  count={count}
                  pageSize={
                    (queryParams.pageSize &&
                      parseInt(queryParams.pageSize, 10)) ||
                    DEFAULT_PAGE_SIZE
                  }
                  onChange={this.handleChangePage}
                />
              ) : null
            }
            {...extraProps}
          />
          {ActionComponent && <ActionComponent />}
        </Box>
      </FiltersWrapper>
    );

    const results = (
      <>
        {isLoading && Loading && <Loading />}
        {showTable && !(Loading && !isFirstQuery) && (
          <Box
            position="relative"
            bg="white"
            style={{ border: `1px solid ${colors.form.border}` }}
          >
            <TableComponent
              data={data}
              customTableDef={customTableDef}
              onRowClick={onRowClick}
              queryParams={queryParams}
              onSortChange={this.handleChangeSort}
              {...extraProps}
            />
            <LoadingCanvas show={isLoading && data.length} />
          </Box>
        )}
      </>
    );

    return (
      <Box>
        {filters}
        {results}
      </Box>
    );
  }
}

const styles = {
  initialLoading: {
    height: 250,
    color: colors.steel,
    background: darken(colors.form.bg, 0.02),
    border: `1px solid ${colors.form.border}`,
    borderRadius: 2,
  },
};

const LoadingCanvas = styled.div`
  position: absolute;
  top: 59px; // muitable header height + padding
  left: 2px;
  right: 2px;
  bottom: 2px;
  pointer-events: ${p => (p.show ? "auto" : "none")};
  background: rgba(255, 255, 255, 0.5);
  opacity: ${p => (p.show ? 1 : 0)};
  transition: 100ms linear opacity;
`;

const FiltersWrapper = styled.div`
  border: 1px solid ${colors.form.border};
  border-bottom: none;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  padding: 10px;
  background: white;
`;

const InitialLoading = () => (
  <Box align="center" justify="center" style={styles.initialLoading}>
    <Spinner />
  </Box>
);

function resolveData(response) {
  if (!response) {
    return [];
  }
  try {
    if (Array.isArray(response)) {
      console.warn("Response is not paginated");
      return response;
    }
    return response.edges.map(el => el.node);
  } catch (err) {
    console.warn("Request cant be parsed", err);
    return [];
  }
}

function resolveCount(data: Array<any>, response: ?Object): number {
  return (
    (data.length > 0 &&
      response &&
      response.pageInfo &&
      response.pageInfo.count) ||
    0
  );
}

export default connectData(DataSearch);
