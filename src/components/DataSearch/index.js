// @flow

import React, { PureComponent } from "react";
import Mutation from "restlay/Mutation";
import styled from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import qs from "query-string";
import omit from "lodash/omit";
import { MdCloudDownload } from "react-icons/md";
import type { ObjectParameters } from "query-string";
import type { MemoryHistory } from "history";

import colors from "shared/colors";
import { minWait } from "utils/promise";

import connectData from "restlay/connectData";
import type { RestlayEnvironment } from "restlay/connectData";
import type { TableDefinition } from "components/Table/types";
import ConnectionQuery from "restlay/ConnectionQuery";

import Box from "components/base/Box";
import Text from "components/base/Text";
import Card from "components/base/Card";

type Props<T> = {
  TableComponent: React$ComponentType<*>,
  FilterComponent: React$ComponentType<*>,
  HeaderComponent?: React$ComponentType<*>,
  customTableDef?: TableDefinition,
  restlay: RestlayEnvironment,
  Query: (*) => ConnectionQuery<*, *>,
  extraProps: Object,
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

class DataSearch extends PureComponent<Props<*>, State> {
  constructor(props) {
    super(props);
    const { history } = this.props;
    const queryParams = history ? qs.parse(window.location.search) : {};

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
    const { Query, restlay } = this.props;
    const { queryParams } = this.state;

    const _requestId = ++this._requestId;

    this.setState({ status: "loading" });

    let patch = null;

    try {
      const query = new Query(queryParams);
      const response = await minWait(restlay.fetchQuery(query), 500);
      patch = { status: "idle", response, error: null };
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

  render() {
    const {
      TableComponent,
      FilterComponent,
      HeaderComponent,
      customTableDef,
      onRowClick,
      extraProps,
    } = this.props;

    const { status, response, error, queryParams } = this.state;
    const data = resolveData(response);
    const isFirstQuery = this._requestId <= 1;

    if (status === "error") {
      return (
        <Card>
          <Text>
            Oww.. snap. Error.
            <br />
            {error && error.message}
          </Text>
          <button onClick={this.fetch}>retry</button>
        </Card>
      );
    }

    const Loading = isFirstQuery ? InitialLoading : SpinnerCircle;
    const showTable = !(
      isFirstQuery &&
      (status === "initial" || status === "loading")
    );

    return (
      <Box horizontal flow={20} align="flex-start">
        <Card grow>
          {HeaderComponent && <HeaderComponent />}
          {status === "loading" && <Loading />}
          {showTable && (
            <TableComponent
              data={data}
              customTableDef={customTableDef}
              onRowClick={onRowClick}
              queryParams={queryParams}
              onSortChange={this.handleChangeSort}
              {...extraProps}
            />
          )}
        </Card>
        <FilterComponent
          noShrink
          width={400}
          onChange={this.handleUpdateQueryParams}
          queryParams={queryParams}
          nbResults={status === "idle" ? data.length : null}
          {...extraProps}
        />
      </Box>
    );
  }
}

const styles = {
  initialLoading: {
    height: 250,
    color: colors.steel,
  },
};

const SpinnerCircleContainer = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2.5px 2.5px 0 rgba(0, 0, 0, 0.1);
  z-index: 1;
`;

const SpinnerCircle = () => (
  <SpinnerCircleContainer>
    <CircularProgress size={30} color="primary" />
  </SpinnerCircleContainer>
);

const InitialLoading = () => (
  <Box align="center" justify="center" style={styles.initialLoading}>
    <SpinnerCircle />
    <MdCloudDownload color={colors.lightGrey} size={40} />
    <Text>Retrieving data...</Text>
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

export default connectData(DataSearch);
