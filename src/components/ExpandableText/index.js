// @flow
import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";

type Props = {
  text: string,
  dataTest?: string,
  className: ?string,
  size: number
};
class ExpandableText extends Component<Props> {
  render() {
    const { text, className, size, dataTest } = this.props;
    const visibleText = text.length > size ? `${text.slice(0, size)}...` : text;
    return (
      <Tooltip title={text}>
        <span className={className} data-test={dataTest}>
          {visibleText}
        </span>
      </Tooltip>
    );
  }
}

export default ExpandableText;
