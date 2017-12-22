// @flow
import React, { Component } from "react";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import type { Unit } from "../../../data/types";

class UnitSelect extends Component<{
  units: Array<Unit>,
  index: number,
  onChange: number => void
}> {
  renderValue = (index: number) => this.props.units[index].code;

  onChange = (e: SyntheticEvent<>) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { index, units } = this.props;
    return (
      <Select
        value={index}
        onChange={this.onChange}
        renderValue={this.renderValue}
      >
        {units.map((unit, i) => (
          <MenuItem disableRipple value={i} key={i}>
            {unit.code}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default UnitSelect;
