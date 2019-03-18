// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans } from "react-i18next";

import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";
import {
  hasPending,
  isMemberOfAccount,
  getPendingsOperations,
} from "utils/operations";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import SelectAccount from "components/SelectAccount";

import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import Box from "components/base/Box";
import { ModalFooter } from "components/base/Modal";
import InfoBox from "components/base/InfoBox";
import DialogButton from "components/buttons/DialogButton";

import type { Account, Operation, User } from "data/types";

function isAccountAvailable(
  account: Account,
  pendingApprovalOperations: Operation[],
  me: User,
) {
  return (
    account.balance > 0 &&
    !hasPending(account, pendingApprovalOperations) &&
    isMemberOfAccount(account, me) &&
    !isAccountOutdated(account) &&
    !isAccountBeingUpdated(account)
  );
}

type Props = {
  onTabChange: (SyntheticInputEvent<*>, number) => void,
  accounts: Account[],
  account: ?Account,
  me: User,
  selectAccount: (?Account) => void,
  allPendingOperations: Operation[],
};

type State = {
  // used to "capture" the account if invalid, so we can display
  // a value in the Select while sending onChange(null) to the parent
  // so it correctly disable the flow steps
  invalidAccount: ?Account,
};

class SendAccount extends PureComponent<Props, State> {
  state = {
    invalidAccount: null,
  };

  onChangeTab = e => {
    // TODO: re-evaluate this tabIndex system
    this.props.onTabChange(e, 1);
  };

  handleChooseAccount = (account: ?Account) => {
    const { selectAccount, allPendingOperations, me } = this.props;
    if (!account) return selectAccount(null);

    const pendingApprovalOperations = getPendingsOperations(
      allPendingOperations,
    );

    if (!isAccountAvailable(account, pendingApprovalOperations, me)) {
      selectAccount(null);
      this.setState({ invalidAccount: account });
    } else {
      selectAccount(account);
      this.setState({ invalidAccount: null });
    }
  };

  render() {
    const { accounts, account } = this.props;
    const { invalidAccount } = this.state;

    return (
      <Fragment>
        <ModalSubTitle noPadding>
          <Trans i18nKey="send:account.title" />
        </ModalSubTitle>
        <Box flow={20}>
          <SelectAccount
            accounts={accounts}
            value={invalidAccount || account}
            onChange={this.handleChooseAccount}
            autoFocus
            openMenuOnFocus
          />
          {invalidAccount && (
            <InfoBox type="warning">
              <Trans i18nKey="send:account.available_accounts">
                {"text"}
                <ul>
                  <li>el-1</li>
                  <li>el-2</li>
                  <li>el-3</li>
                </ul>
              </Trans>
            </InfoBox>
          )}
        </Box>
        <ModalFooter>
          <DialogButton
            highlight
            right
            onTouchTap={this.onChangeTab}
            disabled={!account}
          >
            <Trans i18nKey="common:continue" />
          </DialogButton>
        </ModalFooter>
      </Fragment>
    );
  }
}

export default connectData(SendAccount, {
  queries: {
    accounts: AccountsQuery,
    me: ProfileQuery,
    allPendingOperations: PendingOperationsQuery,
  },
});
