import React, { Component } from "react";
import classNames from "classnames";
import MUISelect from "material-ui/Select";
import ArrowDown from "./icons/full/ArrowDown";

class SelectBubble extends Component<{
  tickerRight?: boolean,
  arrowDownLeft?: boolean,
  color?: string,
  renderValue?: *,
  children?: *,
  MenuProps?: *,
  className?: *
}> {
  render() {
    const {
      tickerRight,
      color,
      arrowDownLeft,
      renderValue,
      ...props
    } = this.props;
    let renderValueProps = value => (
      <span style={{ color }}>
        {arrowDownLeft ? (
          <ArrowDown width={11} style={{ marginRight: 10 }} />
        ) : null}
        {renderValue ? renderValue(value) : value}
      </span>
    );
    return (
      <MUISelect
        {...props}
        className={classNames(
          {
            "MuiSelect-disable-arrow": arrowDownLeft
          },
          props.className
        )}
        renderValue={renderValueProps}
        MenuProps={{
          className: classNames({
            "MuiListItem-ticker-right": tickerRight
          }),
          ...props.MenuProps
        }}
      >
        {props.children}
      </MUISelect>
    );
  }
}

export default SelectBubble;
