//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./index.css";

class ViewAllLink extends Component<{
  to: string,
  children: React$Node | string
}> {
  static defaultProps = {
    children: "VIEW ALL"
  };
  render() {
    const { to, children } = this.props;
    return (
      <Link className="view-all-link" to={to}>
        {children}
      </Link>
    );
  }
}

export default ViewAllLink;
