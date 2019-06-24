// @flow
import React, { PureComponent } from "react";
import { withMe } from "components/UserContextProvider";
import type { User, UserRole } from "data/types";

type Props = {
  children: *,
  subLink?: string,
  support?: boolean,
  className?: string,
  me: ?User,
};

const urlHelp = "http://help.vault.ledger.com";
const urlSupport = "https://support.vault.ledger.com";

export const urlByRole: { [_: UserRole]: string } = {
  OPERATOR: `${urlHelp}/operator`,
  ADMIN: `${urlHelp}/administrator`,
};
class HelpLink extends PureComponent<Props> {
  render() {
    // define support center link
    const { subLink, className, support, me, ...props } = this.props;
    let href = me ? urlByRole[me.role] : urlHelp;

    if (subLink) {
      href += subLink;
    }

    if (support) {
      href = urlSupport;
    }

    return (
      <a
        href={href}
        className={className || ""}
        target="new"
        style={{ verticalAlign: "middle" }}
        {...props}
      >
        {this.props.children}
      </a>
    );
  }
}
export default withMe(HelpLink);
