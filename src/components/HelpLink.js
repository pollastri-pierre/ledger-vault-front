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
      <a
        href="http://alpha.vault.ledger.fr:81"
        className={this.props.className}
        target="new"
      >
        {this.props.children}
      </a>
    );
  }
}
export default HelpLink;
