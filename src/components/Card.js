//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import common from "shared/common";
import classnames from "classnames";

const styles = {
  base: {
    background: "white",
    padding: "40px",
    boxShadow: "0 2.5px 2.5px 0 rgba(0,0,0,.04)",
    position: "relative",
    marginBottom: "20px",
    boxSizing: "border-box",
    "& > header": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      "& > h3": {
        textTransform: "uppercase",
        fontSize: "11px",
        fontWeight: "600",
        color: "black",
        margin: "0 0 20px",
        "& a": {
          ...common.blueLink
        }
      }
    }
  },
  reloading: {
    opacity: 0.5
  }
};

class Header extends Component<{
  title?: React$Node | string,
  titleRight?: React$Node | string
}> {
  render() {
    const { title, titleRight } = this.props;
    return (
      <header>
        <h3>{title}</h3>
        {titleRight ? <h3 className="title-right">{titleRight}</h3> : null}
      </header>
    );
  }
}

class Card extends Component<{
  Header: React$ComponentType<*>,
  children: React$Node | string,
  className: string,
  reloading?: boolean,
  classes: Object
}> {
  static defaultProps = {
    Header
  };
  render() {
    const { Header, children, classes, reloading, className } = this.props;
    return (
      <div className={classnames(classes.base, className)}>
        <Header {...this.props} />
        <div className={reloading ? [classes.reloading] : ""}>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Card);
