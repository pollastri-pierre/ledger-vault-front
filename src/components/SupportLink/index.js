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
          href="http://alpha.vault.ledger.fr:81"
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
