//@flow
import React, { Component } from "react";

class Card extends Component<*> {
  props: {
    title: string,
    className: string,
    reloading: boolean,
    titleRight: *,
    children: *
  };
  static defaultProps = { className: "" };
  render() {
    const { title, titleRight, children, className, reloading } = this.props;
    return (
      <div className={`bloc ${className} ${reloading ? "reloading" : ""}`}>
        <header>
          <h3>{title}</h3>
          {titleRight ? <h3 className="title-right">{titleRight}</h3> : null}
        </header>
        <div className="bloc-content">{children}</div>
      </div>
    );
  }
}

export default Card;
