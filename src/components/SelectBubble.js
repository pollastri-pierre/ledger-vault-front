import React, { Component } from "react";
import classNames from "classnames";
import MUISelect from "material-ui/Select";
import ArrowDown from "./icons/full/ArrowDown";

class SelectBubble extends Component<{
  triangleLeft?: boolean,
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
      triangleLeft,
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
            "MuiPopover-triangle-left": triangleLeft,
            "MuiListItem-ticker-right": tickerRight
          }),
          anchorOrigin: {
            horizontal: triangleLeft ? "left" : "right",
            vertical: "top"
          },
          transformOrigin: {
            horizontal: triangleLeft ? "left" : "right",
            vertical: -70
          },
          PaperProps: {
            style: {
              maxHeight: 200,
              width: 100
            }
          },
          ...props.MenuProps
        }}
      >
        {props.children}
      </MUISelect>
    );
  }
}

export default SelectBubble;
