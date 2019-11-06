// @flow

import React, { PureComponent, Children, cloneElement } from "react";
import styled from "styled-components";
import type { ObjectParameters, ObjectParameter } from "query-string";
import isEqual from "lodash/isEqual";

import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import ExportToCSV from "components/ExportToCSV";
import type { ExportEntityType } from "components/ExportToCSV";

import type { QueryUpdater } from "../types";

export const defaultFieldProps = {
  queryParams: {},
  updateQueryParams: () => {},
};

type Props = {
  title: string,
  nbResults?: number,
  queryParams: ObjectParameters,
  children: React$Node,
  onChange: ObjectParameters => void,
  paginator: ?React$Node,
  withNoAction?: boolean,
  exportEntityType?: ExportEntityType,
};

const fieldsToExclude = ["page", "pageSize"];

class FiltersCard extends PureComponent<Props> {
  handleUpdateKey = (
    keyOrUpdater: string | QueryUpdater,
    val: ?ObjectParameter | ?$ReadOnlyArray<ObjectParameter>,
  ) => {
    const { queryParams } = this.props;
    let newQueryParams;
    if (typeof keyOrUpdater === "function") {
      newQueryParams = keyOrUpdater(queryParams);
    } else {
      newQueryParams = { ...queryParams, [keyOrUpdater]: val || undefined };
    }
    this.handleChange(newQueryParams);
  };

  handleClear = () => {
    const patch = fieldsToExclude.reduce(
      (acc, field) => ({
        ...acc,
        [field]: this.props.queryParams[field],
      }),
      {},
    );
    this.handleChange(patch);
  };

  handleChange = (newQueryParams: ObjectParameters) => {
    const { onChange, queryParams } = this.props;
    if (isEqual(queryParams, newQueryParams)) return;
    onChange(newQueryParams);
  };

  render() {
    const {
      title,
      nbResults,
      children,
      queryParams,
      paginator,
      onChange: _onChange,
      withNoAction,
      exportEntityType,
      ...props
    } = this.props;

    const childProps = {
      queryParams,
      updateQueryParams: this.handleUpdateKey,
    };

    const filters = Children.map(
      children,
      c => c && cloneElement(c, childProps),
    );
    const hasFilters = hasProps(queryParams);
    const showNbResults = typeof nbResults === "number";

    return (
      <Box overflow="visible" position="relative" flow={10} grow {...props}>
        <Filters withNoAction={withNoAction}>{filters}</Filters>
        <Box
          align="center"
          justify="space-between"
          horizontal
          color={colors.mediumGrey}
          style={styles.resultsRow}
        >
          <Box align="center" horizontal flow={10}>
            {hasFilters && (
              <ClearButton onClick={this.handleClear}>
                <Text>Clear filters</Text>
              </ClearButton>
            )}
            <Text noSelect>
              {showNbResults
                ? `${nbResults || 0} result(s) found`
                : "Loading..."}
            </Text>
            {showNbResults && exportEntityType && (
              <ExportToCSV
                queryParams={queryParams}
                entityType={exportEntityType}
              />
            )}
          </Box>
          {paginator}
        </Box>
      </Box>
    );
  }
}

const styles = {
  resultsRow: {
    height: 32,
  },
};

function hasProps(obj) {
  for (const i in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, i) &&
      obj[i] &&
      fieldsToExclude.indexOf(i) === -1
    )
      return true;
  }
  return false;
}

const ClearButton = styled.div`
  cursor: pointer;
  color: ${colors.grenade};

  &:hover {
    text-decoration: underline;
  }
`;

const Filters = styled(Box).attrs({
  horizontal: true,
  align: "flex-start",
  flexWrap: "wrap",
})`
  padding-right: ${p => (p.withNoAction ? "" : "150px")};
  > * {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  margin-bottom: -5px;
`;

export default FiltersCard;
