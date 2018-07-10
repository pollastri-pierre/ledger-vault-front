//@flow
import React, { PureComponent } from "react";

type Props = {
  children: *,
  subLink?: string,
  className?: string
};
class HelpLink extends PureComponent<Props> {
  render() {
    // define support center link
    const { subLink, className } = this.props;
    const href = subLink
      ? `http://help.vault.ledger.com${subLink}`
      : "http://help.vault.ledger.com";

    return (
      <a href={href} className={className ? className : ""} target="new">
        {this.props.children}
      </a>
    );
  }
}
export default HelpLink;
