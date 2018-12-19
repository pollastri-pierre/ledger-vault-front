//@flow
import React, { PureComponent, Fragment } from "react";
import MenuList from "@material-ui/core/MenuList";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import DialogButton from "../buttons/DialogButton";
import AccountMenuItem from "components/operations/creation/AccountMenuItem";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { isAccountOutdated, isAccountBeingUpdated } from "utils/accounts";
import { getPendingsOperations } from "utils/operations";
import { hasPending, isMemberOfAccount } from "utils/operations";
import Disabled from "components/Disabled";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import type { Account, Operation, Member } from "data/types";

import SendLayout from "./SendLayout";

const styles = {};

type Props = {
  onTabChange: (SyntheticInputEvent<*>, number) => void,
  classes: { [_: $Keys<typeof styles>]: string },
  accounts: Account[],
  account: ?Account,
  me: Member,
  selectAccount: Account => void,
  allPendingOperations: Operation[]
};
type State = {};

class SendAccount extends PureComponent<Props, State> {
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
    return (
      <SendLayout
        header={null}
        content={
          <Fragment>
            <ModalSubTitle>
              <Trans i18nKey="send:account.title" />
            </ModalSubTitle>
            <MenuList data-test="operation-creation-accounts">
              {accounts.filter(a => a.status === "APPROVED").map(acc => {
                return (
                  <Disabled
                    key={acc.id}
                    disabled={
                      acc.balance <= 0 ||
                      hasPending(acc, pendingApprovalOperations) ||
                      !isMemberOfAccount(acc, me) ||
                      isAccountOutdated(acc) ||
                      isAccountBeingUpdated(acc)
                    }
                  >
                    <AccountMenuItem
                      onSelect={selectAccount}
                      account={acc}
                      selected={(account && account.id) === acc.id}
                    />
                  </Disabled>
                );
              })}
            </MenuList>
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
