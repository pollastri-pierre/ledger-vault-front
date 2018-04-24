//@flow
import React, { PureComponent } from "react";

type Props = {
  children: *,
  className?: string
};
class HelpLink extends PureComponent<Props> {
  render() {
    // define support center link
    return (
      <a href="#" className={this.props.className}>
        {this.props.children}
      </a>
    );
  }
}
export default HelpLink;
