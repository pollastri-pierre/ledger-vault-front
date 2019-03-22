// @flow

import React, { PureComponent, Children, cloneElement } from "react";
import type { ObjectParameters, ObjectParameter } from "query-string";
import isEqual from "lodash/isEqual";

import Card from "components/base/Card";
import Box from "components/base/Box";

import FiltersCardHeader from "./FiltersCardHeader";
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

  handleClear = () =>
    this.handleChange({
      page: this.props.queryParams.page,
      pageSize: this.props.queryParams.pageSize,
    });

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

    const content = Children.map(children, c => cloneElement(c, childProps));
    const hasFilters = hasProps(queryParams);

    return (
      <Card overflow="visible" flow={40} noShrink {...props}>
        <FiltersCardHeader
          title={title}
          nbResults={nbResults}
          onClear={hasFilters ? this.handleClear : undefined}
        />
        <Box flow={40}>{content}</Box>
      </Card>
    );
  }
}

function hasProps(obj) {
  for (const i in obj) {
    if (
      Object.prototype.hasOwnProperty.call(obj, i) &&
      obj[i] &&
      i !== "pageSize" &&
      i !== "page"
    )
      return true;
  }
  return false;
}

export default FiltersCard;
