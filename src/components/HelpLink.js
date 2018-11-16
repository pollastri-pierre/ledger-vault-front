//@flow
import React, { PureComponent } from "react";

type Props = {
  children: *,
  subLink?: string,
  support: boolean,
  className?: string
};
class HelpLink extends PureComponent<Props> {
  render() {
    // define support center link
    const { subLink, className, support } = this.props;
    let href = subLink
      ? `http://help.vault.ledger.com${subLink}`
      : "http://help.vault.ledger.com";

    if (support) {
      href = "https://support.vault.ledger.com";
    }

    return (
      <a href={href} className={className ? className : ""} target="new">
        {this.props.children}
      </a>
    );
  }
}
export default HelpLink;
