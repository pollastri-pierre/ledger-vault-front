// @flow

import React, { PureComponent, Children, cloneElement } from "react";
import styled from "styled-components";
import type { ObjectParameters, ObjectParameter } from "query-string";
import isEqual from "lodash/isEqual";

import colors, { opacity } from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";

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
      onChange: _onChange,
      ...props
    } = this.props;

    const childProps = {
      queryParams,
      updateQueryParams: this.handleUpdateKey,
    };

    const filters = Children.map(children, c => cloneElement(c, childProps));
    const hasFilters = hasProps(queryParams);
    const showNbResults = typeof nbResults === "number";

    return (
      <Container {...props}>
        <Filters>{filters}</Filters>
        <Box horizontal flow={10} color={colors.mediumGrey}>
          <Text small>
            {showNbResults ? `${nbResults || 0} result(s) found` : "Loading..."}
          </Text>
          {hasFilters && (
            <ClearButton onClick={this.handleClear}>Clear filters</ClearButton>
          )}
        </Box>
      </Container>
    );
  }
}

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
  color: ${opacity(colors.grenade, 0.7)};
  cursor: pointer;

  &:hover {
    color: ${opacity(colors.grenade, 0.8)};
    text-decoration: underline;
  }

  &:active {
    color: ${colors.grenade};
  }
`;

const Filters = styled(Box).attrs({
  horizontal: true,
  align: "flex-start",
  flexWrap: "wrap",
})`
  padding-right: 150px;
  > * {
    margin-right: 5px;
    margin-bottom: 5px;
  }
  margin-bottom: -5px;
`;

const Container = styled(Box).attrs({
  overflow: "visible",
  position: "relative",
  flow: 10,
  noShrink: true,
  pb: 20,
})``;

export default FiltersCard;
