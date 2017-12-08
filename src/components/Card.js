//@flow
import React, { Component } from "react";

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
  reloading?: boolean
}> {
  static defaultProps = {
    Header: Header,
    className: ""
  };
  render() {
    const { Header, children, className, reloading } = this.props;
    return (
      <div className={`bloc ${className} ${reloading ? "reloading" : ""}`}>
        <Header {...this.props} />
        <div className="bloc-content">{children}</div>
      </div>
    );
  }
}

export default Card;
