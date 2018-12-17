//@flow
import React, { Component, Fragment } from "react";
import { isValidAccountName } from "utils/accounts";
import CurrencyIndex from "components/CurrencyIndex";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import type { RestlayEnvironment } from "restlay/connectData";
import network from "network";
import MenuItem from "@material-ui/core/MenuItem";
import DeviceAuthenticate from "components/DeviceAuthenticate";
import AccountCreationMembers from "components/accounts/creation/AccountCreationMembers";
import Disabled from "components/Disabled";
import AccountCreationApprovals from "components/accounts/creation/AccountCreationApprovals";
import MembersQuery from "api/queries/MembersQuery";
import connectData from "restlay/connectData";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { getOutdatedAccounts } from "utils/accounts";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { addMessage } from "redux/modules/alerts";
import type { Translate, Member } from "data/types";
import DialogButton from "components/buttons/DialogButton";
import UpdateTextField from "./UpdateTextField";
import RowSelectable from "./RowSelectable";
import Row from "./Row";
import {
  toggleModal,
  toggleMembers,
  toggleDevice,
  toggleApprovals,
  toggleMember,
  editQuorum,
  selectAccount
} from "redux/modules/update-accounts";
import type { Account } from "data/types";
import BlurDialog from "components/BlurDialog";

const styles = {
  accountItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "normal",
    fontWeight: "normal",
    fontSize: 13,
    height: 40,
    padding: "5px 20px"
  },
  base: {
    width: 800,
    display: "flex",
    "& h2, & h3": {
      margin: 0
    },
    "& ul": {
      margin: 0,
      padding: 0
    },
    "& p": {
      fontSize: 14,
      lineHeight: "24px"
    }
  },
  left: {
    width: 300,
    maxHeight: 433,
    overflow: "auto",
    padding: "20px 20px 20px 0",
    backgroundColor: "#f9f9f9"
  },
  content: {
    padding: "40px 40px 0 40px"
  },
  footer: {
    marginTop: 40,
    display: "flex",
    justifyContent: "space-between"
  },
  accountName: {
    paddingLeft: 25
  }
};

type Props = {
  accounts: Account[],
  selectedAccount: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  approvers: Member[],
  members: Member[],
  isSelectingMembers: boolean,
  isSelectingApprovals: boolean,
  isDevice: boolean,
  isOpen: boolean,
  quorum: number,
  onToggle: Function,
  onToggleMembers: Function,
  onToggleApprovals: Function,
  onEditQuorum: Function,
  onToggleMember: Function,
  onToggleDevice: Function,
  onSelectAccount: Function,
  onAddMessage: Function,
  restlay: RestlayEnvironment,
  t: Translate
};

type State = {
  accountName: string
};

class UpdateAccounts extends Component<Props, State> {
  state: State = {
    accountName: ""
  };
  componentDidUpdate() {
    const { selectedAccount, accounts, onSelectAccount, isOpen } = this.props;
    const outdatedAccounts = getOutdatedAccounts(accounts);
    if (!selectedAccount && outdatedAccounts.length > 0 && isOpen) {
      onSelectAccount(outdatedAccounts[0]);
    }
  }

  onChangeAccountName = (e: SyntheticInputEvent<>) => {
    this.setState({ accountName: e.target.value });
  };
  updateAccount = async () => {
    const { onToggle, restlay, onToggleDevice, onAddMessage } = this.props;
    const data = {
      members: this.props.approvers.map(approver => ({ pub_key: approver })),
      security_scheme: {
        quorum: this.props.quorum
      }
    };
    try {
      await network(`/accounts/${this.props.selectedAccount.id}`, "PUT", {
        name: this.state.accountName
      });
      await network(
        `/accounts/${this.props.selectedAccount.id}/security-scheme`,
        "PUT",
        data
      );
      await restlay.fetchQuery(new AccountsQuery());
      await restlay.fetchQuery(new PendingAccountsQuery());
      onToggleDevice();
      onToggle();
    } catch (e) {
      console.error(e);
      if (e.json && e.json.message) {
        onAddMessage("Error", e.json.message, "error");
      } else {
        onAddMessage("Error", "Something went wrong.", "error");
      }
      onToggleDevice();
    }
  };
  render() {
    const {
      accounts,
      t,
      classes,
      isOpen,
      quorum,
      selectedAccount,
      approvers,
      members,
      onToggle,
      onToggleMembers,
      onToggleApprovals,
      isDevice,
      onEditQuorum,
      onToggleDevice,
      onToggleMember,
      isSelectingMembers,
      isSelectingApprovals,
      onSelectAccount
    } = this.props;

    const { accountName } = this.state;
    return (
      <Fragment>
        <BlurDialog open={isOpen} onClose={onToggle}>
          <div className={classes.base}>
            <div className={classes.left}>
              <h3 style={{ padding: "21px 33px 20px 40px" }}>Accounts</h3>
              <ul>
                {getOutdatedAccounts(accounts).map(account => (
                  <MenuItem
                    button
                    className={classes.accountItem}
                    disableRipple
                    selected={
                      selectedAccount && selectedAccount.id === account.id
                    }
                    onClick={() => onSelectAccount(account)}
                    key={account.id}
                  >
                    <span className={classes.accountName}>
                      <div>TO DO</div>
                      <CurrencyIndex
                        currency={account.currency.name}
                        index={account.index}
                      />
                    </span>
                  </MenuItem>
                ))}
              </ul>
            </div>
            <div className={classes.content}>
              <h3>{t("updateAccounts:provide")}</h3>
              <p>{t("updateAccounts:desc")}</p>
              {selectedAccount && (
                <div>
                  <Row label="Account">
                    <UpdateTextField
                      name="account_name"
                      placeholder="account name"
                      value={accountName}
                      onChange={this.onChangeAccountName}
                      error={!isValidAccountName(accountName)}
                      errorMessage="only ASCII char, 19 max length"
                    />
                  </Row>
                  <Row label="Cryptocurrency / Index">
                    <CurrencyIndex
                      currency={selectedAccount.currency.name}
                      index={selectedAccount.index}
                    />
                  </Row>
                  <Row label="Balance">
                    <CurrencyAccountValue
                      account={selectedAccount}
                      value={selectedAccount.balance}
                    />
                  </Row>
                  <Row label="Operation rules" noBorder>
                    <div>
                      <RowSelectable
                        label="members"
                        descriptionSelected="selected"
                        onClick={onToggleMembers}
                        value={approvers.length}
                      />
                    </div>
                    <div>
                      <Disabled disabled={approvers.length === 0}>
                        <RowSelectable
                          noBorder
                          label="approvals"
                          descriptionSelected="required"
                          onClick={onToggleApprovals}
                          value={quorum}
                        />
                      </Disabled>
                    </div>
                  </Row>
                  <div className={classes.footer}>
                    <DialogButton onTouchTap={onToggle}>Cancel</DialogButton>
                    <DialogButton
                      highlight
                      onTouchTap={onToggleDevice}
                      disabled={
                        approvers.length === 0 ||
                        quorum === 0 ||
                        accountName === "" ||
                        !isValidAccountName(accountName) ||
                        quorum > approvers.length
                      }
                    >
                      Submit
                    </DialogButton>
                  </div>
                </div>
              )}
            </div>
          </div>
        </BlurDialog>
        <BlurDialog open={isSelectingMembers} onClose={onToggleMembers}>
          <AccountCreationMembers
            members={members}
            approvers={approvers}
            addMember={onToggleMember}
            switchInternalModal={onToggleMembers}
          />
        </BlurDialog>
        <BlurDialog open={isSelectingApprovals} onClose={onToggleApprovals}>
          <AccountCreationApprovals
            members={approvers}
            approvals={quorum}
            setApprovals={onEditQuorum}
            switchInternalModal={onToggleApprovals}
          />
        </BlurDialog>
        <BlurDialog open={isDevice} onClose={onToggleDevice}>
          <DeviceAuthenticate
            cancel={onToggleDevice}
            type="accounts"
            account_id={
              this.props.selectedAccount && this.props.selectedAccount.id
            }
            callback={this.updateAccount}
          />
        </BlurDialog>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.updateAccounts.isOpen,
  selectedAccount: state.updateAccounts.account,
  approvers: state.updateAccounts.members,
  quorum: state.updateAccounts.quorum,
  isDevice: state.updateAccounts.isDevice,
  isSelectingMembers: state.updateAccounts.isSelectingMembers,
  isSelectingApprovals: state.updateAccounts.isSelectingApprovals
});
const mapDispatchToProps = (dispatch: *) => ({
  onToggle: () => dispatch(toggleModal()),
  onToggleMembers: () => dispatch(toggleMembers()),
  onToggleMember: member => dispatch(toggleMember(member)),
  onToggleDevice: () => dispatch(toggleDevice()),
  onEditQuorum: number => dispatch(editQuorum(number)),
  onToggleApprovals: () => dispatch(toggleApprovals()),
  onAddMessage: (title, message, type) =>
    dispatch(addMessage(title, message, type)),
  onSelectAccount: account => dispatch(selectAccount(account))
});

export default connectData(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withStyles(styles)(translate()(UpdateAccounts))),
  {
    queries: {
      members: MembersQuery
    }
  }
);
