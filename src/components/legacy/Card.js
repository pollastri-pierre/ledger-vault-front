// @flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
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
          ...common.blueLink,
        },
      },
    },
  },
  reloading: {
    opacity: 0.5,
  },
  link: {
    textDecoration: "none",
  },
};

class Header extends Component<{
  title?: React$Node | string,
  titleRight?: React$Node | string,
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
  dataTest: ?string,
  reloading?: boolean,
  classes: Object,
  link?: string,
}> {
  static defaultProps = {
    Header,
  };

  render() {
    const {
      Header,
      link,
      children,
      classes,
      reloading,
      dataTest,
      className,
    } = this.props;
    if (link) {
      return (
        <Link
          to={link}
          className={classnames(classes.base, classes.link, className)}
          data-test={dataTest}
        >
          <Header {...this.props} />
          <div className={reloading ? [classes.reloading] : ""}>{children}</div>
        </Link>
      );
    }
    return (
      <div className={classnames(classes.base, className)} data-test={dataTest}>
        <Header {...this.props} />
        <div className={reloading ? [classes.reloading] : ""}>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(Card);
