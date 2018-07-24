// @flow
import React, { Component } from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import colors from "../../../shared/colors";
import { withStyles } from "@material-ui/core/styles";
import ArrowDown from "../../icons/full/ArrowDown";

const styles = {
  menu: {
    color: colors.ocean,
    "& span": {
      color: "black"
    }
  }
};
class MaxSelect extends Component<
  {
    onSetMax: () => void,
    classes: { [_: $Keys<typeof styles>]: string }
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
    const { onSetMax, classes } = this.props;
    const { open, anchorEl } = this.state;
    return (
      <div>
        <div
          style={{
            width: 23,
            lineHeight: "14px",
            height: 28,
            textAlign: "right",
            borderBottom: "1px solid #eee",
            cursor: "pointer"
          }}
          onClick={this.handleClick}
        >
          <ArrowDown style={{ width: 11 }} />
        </div>
        <Menu
          className="MuiListItem-ticker-right MuiPopover-triangle-left"
          open={open}
          anchorEl={anchorEl}
          onClose={this.onClose}
        >
          <MenuItem className={classes.menu} disableRipple onClick={onSetMax}>
            <span>Send max</span>
          </MenuItem>
        </Menu>
      </div>
    );
  }
}

export default withStyles(styles)(MaxSelect);
