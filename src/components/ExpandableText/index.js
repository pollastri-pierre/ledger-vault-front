//@flow
import React, { Component } from "react";
import Tooltip from "@material-ui/core/Tooltip";

type Props = {
  text: string,
  className: ?string,
  size: number
};
class ExpandableText extends Component<Props> {
  render() {
    const { text, className, size } = this.props;
    const visibleText = text.length > size ? text.slice(0, size) + "..." : text;
    return (
      <Tooltip title={text}>
        <span className={className}>{visibleText}</span>
      </Tooltip>
    );
  }
}

export default ExpandableText;
