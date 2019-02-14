// @flow

import React, { Fragment } from "react";
import { Trans, Interpolate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import type { State as AccountCreationState } from "redux/modules/account-creation";

import InfoModal from "components/InfoModal";
import User from "components/icons/User";
import colors from "shared/colors";

import LineRow from "../../LineRow";
import AccountName from "../../AccountName";

type Props = {
  accountCreationState: AccountCreationState,
  classes: { [_: $Keys<typeof styles>]: string }
};
const styles = {
  badgeContainer: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25
  },
  badgeText: {
    margin: "0 5px 0 10px"
  },
  badgeValue: {
    color: colors.lead
  },
  contentRows: {
    marginTop: 50
  },
  infoModal: {
    marginTop: 30
  }
};

function AccountCreationConfirmation(props: Props) {
  const { accountCreationState, classes } = props;
  const { currency, erc20token, approvers, quorum } = accountCreationState;

  return (
    <div>
      <div className={classes.badgeContainer}>
        <User size={16} color={colors.shark} />
        <span className={classes.badgeText}>
          <Trans i18nKey="newAccount:confirmation.members" />
        </span>
        <span className={classes.badgeValue}>
          (<Trans
            i18nKey="newAccount:confirmation.selectedMembers"
            values={{ memberLength: approvers.length }}
          />)
        </span>
      </div>
      <div className={classes.contentRows}>
        {currency && (
          <LineRow label={<Trans i18nKey="newAccount:confirmation.account" />}>
            <AccountName
              currencyId={currency.id}
              name={accountCreationState.name}
            />
          </LineRow>
        )}
        {erc20token && (
          <Fragment>
            <LineRow
              label={<Trans i18nKey="newAccount:confirmation.account" />}
            >
              <AccountName isERC20 name={accountCreationState.name} />
            </LineRow>
            {accountCreationState.parent_account &&
              accountCreationState.parent_account.name && (
                <LineRow
                  label={
                    <Trans i18nKey="newAccount:confirmation.parentAccount" />
                  }
                >
                  {/* $FlowFixMe */}
                  {accountCreationState.parent_account.name}
                </LineRow>
              )}
          </Fragment>
        )}
        {currency && (
          <LineRow label={<Trans i18nKey="newAccount:confirmation.currency" />}>
            <span className="info-value currency">{currency.name}</span>
          </LineRow>
        )}
        <LineRow label={<Trans i18nKey="newAccount:confirmation.approvals" />}>
          <Interpolate
            i18nKey="newAccount:confirmation.approvals_members"
            count={quorum}
            total={approvers.length}
          />
        </LineRow>
      </div>
      <div className={classes.infoModal}>
        <InfoModal className="confirmation-explain">
          {<Trans i18nKey="newAccount:confirmation.desc" />}
        </InfoModal>
      </div>
    </div>
  );
}

export default withStyles(styles)(AccountCreationConfirmation);
