// @flow
import React, { Component } from "react";
import classnames from "classnames";
import colors from "shared/colors";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  tabs: string[],
  onChange: Function,
  selected: number,
  theme?: "inline" | "header",
  classes: Object,
};

const styles = {
  base: {
    display: "flex",
    justifyContent: "space-around",
    paddingBottom: "20px",
    "&> * + *": {
      marginLeft: 20,
    },
  },
  header: {
    borderBottom: `1px solid ${colors.argile}`,
  },
  tab: {
    opacity: "0.5",
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    position: "relative",
    cursor: "pointer",
    "&:after": {
      width: "100%",
      height: "0px",
      backgroundColor: colors.ocean,
      content: '""',
      position: "absolute",
      top: "33px",
      left: "0px",
      transition: "height 200ms ease",
    },
  },

  selected: {
    opacity: "1",
    "&:after": {
      height: "2px",
    },
  },
};

class SelectTab extends Component<Props, {}> {
  static defaultProps = {
    theme: "header",
  };

  render() {
    const { tabs, onChange, selected, theme, classes } = this.props;
    return (
      <div className={classnames(classes.base, classes[theme])}>
        {tabs.map((elem, i) => (
          <div
            className={classnames(classes.tab, {
              [classes.selected]: i === selected,
            })}
            onClick={() => onChange(i)}
            key={i} // eslint-disable-line react/no-array-index-key
          >
            {elem}
          </div>
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(SelectTab);
