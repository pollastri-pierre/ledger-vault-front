//@flow
import React, { Component } from "react";
import injectSheet from "react-jss";
import classnames from "classnames";

const styles = {
  base: {
    background: "white",
    padding: "40px",
    boxShadow: "0 2.5px 2.5px 0 rgba(0,0,0,.04)",
    position: "relative",
    marginBottom: "20px",
    boxSizing: "border-box",
    "& header": {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between"
    }
  },
  h3: {
    textTransform: "uppercase",
    fontSize: "11px",
    fontWeight: "600",
    color: "black",
    margin: "0 0 20px"
  },
  storages: {
    width: "calc(33% - 20px)",
    marginRight: "20px"
  }
};

class Card extends Component<*> {
  props: {
    title: string,
    reloading: boolean,
    titleRight: *,
    children: *,
    classes: Object
  };

  render() {
    const {
      title,
      titleRight,
      children,
      classes,
      reloading,
      storage
    } = this.props;
    return (
      <div
        className={classnames(classes.base, { [classes.storages]: storage })}
      >
        <header>
          <h3 className={classes.h3}>{title}</h3>
          {titleRight ? <h3 className={classes.h3}>{titleRight}</h3> : null}
        </header>
        <div className="bloc-content">{children}</div>
      </div>
    );
  }
}

export default injectSheet(styles)(Card);
