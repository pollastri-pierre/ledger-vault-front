// @flow
import React, { Component } from "react";
import Menu, { MenuItem } from "material-ui/Menu";
import ArrowDown from "../../icons/full/ArrowDown";

class MaxSelect extends Component<
  {
    onSetMax: () => void
  },
  *
> {
  state = {
    open: false,
    anchorEl: null
  };

  handleClick = (event: SyntheticEvent<>) => {
    this.setState({ open: true, anchorEl: event.currentTarget });
  };

  onClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { onSetMax } = this.props;
    const { open, anchorEl } = this.state;
    return (
      <div>
        <div
          style={{
            width: 28,
            height: 28,
            borderBottom: "1px solid #eee",
            cursor: "pointer"
          }}
        >
          <ArrowDown style={{ width: 11 }} onClick={this.handleClick} />
        </div>
        <Menu
          className="MuiListItem-ticker-right MuiPopover-triangle-left"
          open={open}
          anchorEl={anchorEl}
          onClose={this.onClose}
        >
          <MenuItem onClick={onSetMax}>Send max</MenuItem>
        </Menu>
      </div>
    );
  }
}

export default MaxSelect;
