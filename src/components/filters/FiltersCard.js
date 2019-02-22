// @flow

import React, { PureComponent, Children, cloneElement } from "react";
import qs from "query-string";

import type { ObjectParameters, ObjectParameter } from "query-string";

import Card from "components/base/Card";
import Box from "components/base/Box";

import FiltersCardHeader from "./FiltersCardHeader";
import FiltersCardFooter from "./FiltersCardFooter";

export type QueryUpdater = ObjectParameters => ObjectParameters;

export type FieldProps = {
  query: ObjectParameters,
  updateQuery: (
    string | QueryUpdater,
    ?ObjectParameter | ?$ReadOnlyArray<ObjectParameter>
  ) => void
};

export const defaultFieldProps = {
  query: {},
  updateQuery: () => {}
};

type Props = {
  title: string,
  subtitle: string,
  query: string,
  children: React$Node,
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
    val: ?ObjectParameter | ?$ReadOnlyArray<ObjectParameter>
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

    const childProps = {
      query: deserializedQuery,
      updateQuery: this.handleUpdateKey
    };

    const content = Children.map(children, c => cloneElement(c, childProps));

    return (
      <Card p={0} overflow="visible" noShrink {...props}>
        <FiltersCardHeader title={title} subtitle={subtitle} />
        <Box px={20} py={40} flow={40}>
          {content}
        </Box>
        <FiltersCardFooter onClear={this.handleClear} />
      </Card>
    );
  }
}

export default FiltersCard;
