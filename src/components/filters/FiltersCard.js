// @flow

import React, { PureComponent } from "react";
import qs from "query-string";

import type { ObjectParameters, ObjectParameter } from "query-string";

import Card from "components/base/Card";
import Box from "components/base/Box";

import FiltersCardHeader from "./FiltersCardHeader";
import FiltersCardFooter from "./FiltersCardFooter";

export type QueryUpdater = ObjectParameters => ObjectParameters;

export type FieldProps = {
  query: ObjectParameters,
  updateQuery: (string | QueryUpdater, ?ObjectParameter) => void
};

type Props = {
  title: string,
  subtitle: string,
  query: string,
  children: FieldProps => React$Node,
  onChange: string => void
};

type State = {
  deserializedQuery: ObjectParameters
};

class FiltersCard extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const { query } = this.props;

    this.state = {
      // $FlowFixMe
      deserializedQuery: qs.parse(query)
    };
  }

  handleUpdateKey = (
    keyOrUpdater: string | QueryUpdater,
    val: ?ObjectParameter
  ) => {
    const { onChange } = this.props;
    const { deserializedQuery } = this.state;
    let newQuery = { ...deserializedQuery };
    if (typeof keyOrUpdater === "function") {
      newQuery = keyOrUpdater(newQuery);
    } else {
      newQuery = { ...deserializedQuery, [keyOrUpdater]: val || undefined };
    }
    this.setState({ deserializedQuery: newQuery });
    const serialized = qs.stringify(newQuery);
    onChange(serialized);
  };

  handleClear = () => {
    const { onChange } = this.props;
    this.setState({ deserializedQuery: {} });
    onChange("");
  };

  render() {
    const {
      title,
      subtitle,
      children,
      onChange: _onChange,
      ...props
    } = this.props;

    const { deserializedQuery } = this.state;

    const content = children({
      query: deserializedQuery,
      updateQuery: this.handleUpdateKey
    });

    return (
      <Card p={20} flow={30} overflow="visible" noShrink {...props}>
        <FiltersCardHeader title={title} subtitle={subtitle} />
        <Box flow={20}>{content}</Box>
        <FiltersCardFooter onClear={this.handleClear} />
      </Card>
    );
  }
}

export default FiltersCard;
