/* @flow */

import React, { Component } from "react";
import Text from "components/base/Text";

type Props = {
  text: React$Node,
  className?: string
};

class PendingEmptyState extends Component<Props> {
  render() {
    const { text, className } = this.props;

    return <Text className={className}>{text}</Text>;
  }
}
export default PendingEmptyState;
