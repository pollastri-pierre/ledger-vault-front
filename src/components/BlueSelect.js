//@flow
import React, { Component } from "react";
import classNames from "classnames";
import Select from "material-ui/Select";
import BlueSelectRenderValue from "./BlueSelectRenderValue";

class BlueSelect extends Component<{
  renderValue?: *,
  className?: *,
  MenuProps?: *,
  children: *
}> {
  render() {
    const { renderValue, className, MenuProps, children, ...rest } = this.props;
    return (
      <Select
        {...rest}
        renderValue={value => (
          <BlueSelectRenderValue>
            {renderValue ? renderValue(value) : value}
          </BlueSelectRenderValue>
        )}
        className={classNames("MuiSelect-disable-arrow", className)}
        MenuProps={{
          ...MenuProps,
          anchorOrigin: {
            horizontal: "left",
            vertical: "top"
          },
          transformOrigin: {
            horizontal: "left",
            vertical: "top"
          },
          PaperProps: {
            style: {
              maxHeight: 200,
              width: 100
            }
          },
          className: classNames(
            "MuiListItem-ticker-right",
            MenuProps && MenuProps.className
          )
        }}
      >
        {children}
      </Select>
    );
  }
}

export default BlueSelect;
