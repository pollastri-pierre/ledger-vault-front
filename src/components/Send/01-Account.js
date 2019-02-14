// @flow
import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import Box from "components/base/Box";
import Text from "components/base/Text";
import InfoBox from "components/base/InfoBox";
import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";
import {
  hasPending,
  isMemberOfAccount,
  getPendingsOperations
} from "utils/operations";
// import Disabled from "components/Disabled";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import SelectAccount from "components/SelectAccount";
import type { Account, Operation, Member } from "data/types";
import DialogButton from "../buttons/DialogButton";

import SendLayout from "./SendLayout";

const styles = {};

type Props = {
  onTabChange: (SyntheticInputEvent<*>, number) => void,
  classes: { [_: $Keys<typeof styles>]: string },
  accounts: Account[],
  account: ?Account,
  me: Member,
  selectAccount: (?Account) => void,
  allPendingOperations: Operation[]
};

class SendAccount extends PureComponent<Props> {
  onChangeTab = e => {
    // TODO: re-evaluate this tabIndex system
    this.props.onTabChange(e, 1);
  };

  render() {
    const {
      accounts,
      me,
      selectAccount,
      account,
      allPendingOperations
    } = this.props;
    const pendingApprovalOperations = getPendingsOperations(
      allPendingOperations
    );
    // TODO not filter the accounts list but render them disabled in the selected
    const accountsAvailable = accounts.filter(
      account =>
        account.balance <= 0 ||
        hasPending(account, pendingApprovalOperations) ||
        !isMemberOfAccount(account, me) ||
        isAccountOutdated(account) ||
        isAccountBeingUpdated(account)
    );

    return (
      <SendLayout
        content={
          <Fragment>
            <ModalSubTitle>
              <Trans i18nKey="send:account.title" />
            </ModalSubTitle>
            <Box py={20} px={40} flow={20}>
              <SelectAccount
                accounts={accountsAvailable}
                value={account}
                onChange={selectAccount}
                autoFocus
                openMenuOnFocus
              />
              <InfoBox type="info">
                <Text small>
                  <Trans i18nKey="send:account.available_accounts" />
                </Text>
              </InfoBox>
            </Box>
          </Fragment>
        }
        footer={
          <DialogButton
            highlight
            right
            onTouchTap={this.onChangeTab}
            disabled={!account}
          >
            <Trans i18nKey="common:continue" />
          </DialogButton>
        }
      />
    );
  }
}

export default connectData(withStyles(styles)(SendAccount), {
  queries: {
    accounts: AccountsQuery,
    me: ProfileQuery,
    allPendingOperations: PendingOperationsQuery
  }
});
