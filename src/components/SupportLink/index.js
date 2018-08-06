//@flow
import React, { PureComponent } from "react";

type Props = {
  label: string,
  className: string
};
class SupportLink extends PureComponent<Props> {
  render() {
    const { label, className } = this.props;
    return (
      <div>
        <a
          href="https://help.vault.ledger.com"
          target="new"
          className={className}
        >
          {label}
        </a>
      </div>
    );
  }
}

export default SupportLink;
