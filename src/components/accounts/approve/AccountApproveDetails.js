// @flow

import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { Trans } from "react-i18next";

import { getAccountCurrencyName } from "utils/accounts";

import type { Account } from "data/types";

import Amount from "components/Amount";
import User from "components/icons/User";
import colors from "shared/colors";
// NOTE: copy button which is a bit useless here is a temp solution until we re-size modals
import CopyToClipboardButton from "components/CopyToClipboardButton";

import DateFormat from "../../DateFormat";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";

type Props = {
  account: Account,
  accounts: Account[],
  classes: { [_: $Keys<typeof styles>]: string },
};

const styles = {
  badgeContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },
  badgeText: {
    margin: "0 5px 0 10px",
  },
  badgeValue: {
    color: colors.lead,
  },
};

class AccountApproveDetails extends PureComponent<Props> {
  render() {
    const { account, classes, accounts } = this.props;
    const { security_scheme } = account;
    const isERC20 = account.account_type === "ERC20";
    const parentETH = isERC20
      ? accounts.find(a => a.id === account.parent_id)
      : null;

    return (
      <div>
        <div className={classes.badgeContainer}>
          <User size={16} color={colors.shark} />
          <span className={classes.badgeText}>
            <Trans i18nKey="pendingAccount:details.members" />
          </span>
          <span className={classes.badgeValue}>
            (
            <Trans
              i18nKey="pendingAccount:details.selectedMembers"
              values={{ memberLength: account.members.length }}
            />
            )
          </span>
        </div>
        <div>
          <LineRow label={<Trans i18nKey="pendingAccount:details.balance" />}>
            <Amount
              account={account}
              value={account.balance}
              strong
              dataTest="balance"
              erc20Format={account.account_type === "ERC20"}
            />
          </LineRow>
          {isERC20 && (
            <LineRow
              label={<Trans i18nKey="pendingAccount:details.smartContract" />}
            >
              <CopyToClipboardButton textToCopy={account.contract_address} />
            </LineRow>
          )}
          <LineRow label={<Trans i18nKey="pendingAccount:details.date" />}>
            <DateFormat date={account.created_on} dataTest="requested" />
          </LineRow>
          <LineRow label={<Trans i18nKey="pendingAccount:details.name" />}>
            <AccountName account={account} />
          </LineRow>
          {parentETH && (
            <LineRow label={<Trans i18nKey="pendingAccount:details.parent" />}>
              <AccountName account={parentETH} />
            </LineRow>
          )}
          <LineRow label={<Trans i18nKey="pendingAccount:details.currency" />}>
            <span data-test="currency" className="info-value currency">
              {getAccountCurrencyName(account)}
            </span>
          </LineRow>
          <LineRow label={<Trans i18nKey="pendingAccount:details.approvals" />}>
            <Trans
              i18nKey="pendingAccount:details.approvalsRange"
              values={{
                quorum: security_scheme.quorum,
                memberLength: account.members.length,
              }}
            />
          </LineRow>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AccountApproveDetails);
