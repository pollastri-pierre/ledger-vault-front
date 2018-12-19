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
  onTabChange: (number) => void,
  classes: *,
  accounts: Account[],
  selectedAccount: ?Account,
  me: Member,
  selectAccount: Account => void,
  allPendingOperations: Operation[]
};
type State = {

};

class SendAccount extends PureComponent<Props, State> {
  render(){

    const { onTabChange, accounts, me, selectAccount, selectedAccount, allPendingOperations } = this.props;
    const pendingApprovalOperations = getPendingsOperations(
      allPendingOperations
    );

    return (
      <SendLayout
        header={null}
        content={<Fragment>
          <ModalSubTitle><Trans i18nKey="send:account.title" /></ModalSubTitle>
          <MenuList data-test="operation-creation-accounts">
            {accounts.filter(a => a.status === "APPROVED").map(account => {
              return (
                <Disabled
                  key={account.id}
                  disabled={
                    account.balance <= 0 ||
                    hasPending(account, pendingApprovalOperations) ||
                    !isMemberOfAccount(account, me) ||
                    isAccountOutdated(account) ||
                    isAccountBeingUpdated(account)
                  }
                >
                  <AccountMenuItem
                    onSelect={selectAccount}
                    account={account}
                    selected={(selectedAccount && selectedAccount.id) === account.id}
                  />
                </Disabled>
              );
            })}
          </MenuList>
        </Fragment>
      }
        footer={<DialogButton
            highlight
            right
            onTouchTap={() => onTabChange(1)}
          >
            <Trans i18nKey="common:continue" />
          </DialogButton>}
      />
    );
  }
} ;

export default connectData(withStyles(styles)(SendAccount), {
  queries: {
    accounts: AccountsQuery,
    me: ProfileQuery,
    allPendingOperations: PendingOperationsQuery
  }
});
