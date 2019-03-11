// @flow
import React, { Component, Fragment } from "react";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import CurrencyIndex from "components/CurrencyIndex";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import type { RestlayEnvironment } from "restlay/connectData";
import network from "network";
import MenuItem from "@material-ui/core/MenuItem";
import DeviceAuthenticate from "components/DeviceAuthenticate";
import ListApprovers from "components/accounts/ListApprovers";
import Disabled from "components/Disabled";
import SetApprovals from "components/accounts/SetApproval";
import connectData from "restlay/connectData";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { getOutdatedAccounts, isValidAccountName } from "utils/accounts";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { addMessage } from "redux/modules/alerts";
import type { Translate, Member, Account } from "data/types";
import DialogButton from "components/buttons/DialogButton";
import {
  toggleModal,
  toggleMembers,
  toggleDevice,
  toggleApprovals,
  toggleMember,
  editQuorum,
  editName,
  selectAccount
} from "redux/modules/update-accounts";
import BlurDialog from "components/BlurDialog";
import UpdateTextField from "./UpdateTextField";
import RowSelectable from "./RowSelectable";
import Row from "./Row";

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
  isSelectingMembers: boolean,
  isSelectingApprovals: boolean,
  isDevice: boolean,
  isOpen: boolean,
  quorum: number,
  onToggle: Function,
  onToggleMembers: Function,
  onEditName: string => void,
  onToggleApprovals: Function,
  onEditQuorum: Function,
  onToggleMember: Function,
  onToggleDevice: Function,
  onSelectAccount: Function,
  onAddMessage: Function,
  restlay: RestlayEnvironment,
  t: Translate
};

class UpdateAccounts extends Component<Props> {
  componentDidUpdate() {
    const { selectedAccount, accounts, onSelectAccount, isOpen } = this.props;
    const outdatedAccounts = getOutdatedAccounts(accounts);
    if (!selectedAccount && outdatedAccounts.length > 0 && isOpen) {
      onSelectAccount(outdatedAccounts[0]);
    }
  }

  onChangeAccountName = (e: SyntheticInputEvent<>) => {
    this.props.onEditName(e.target.value);
  };

  // a view only only erc20 cannot get its members modified, only the quorum can be updated
  isSelectMembersDisabled = () => {
    const { selectedAccount } = this.props;
    return (
      selectedAccount &&
      selectedAccount.account_type === "ERC20" &&
      selectedAccount.status === "VIEW_ONLY"
    );
  };

  isSubmitDisabled = () => {
    const { approvers, quorum, selectedAccount } = this.props;

    const { name } = selectedAccount;

    const nameDisabled = name === "" || !isValidAccountName(name);

    const rulesDisabled = this.isSelectMembersDisabled()
      ? quorum === 0 || quorum > selectedAccount.members.length
      : approvers.length === 0 || quorum === 0 || quorum > approvers.length;

    return rulesDisabled || nameDisabled;
  };

  updateAccount = async () => {
    const {
      onToggle,
      restlay,
      onToggleDevice,
      onAddMessage,
      selectedAccount
    } = this.props;
    const data: Object = {
      name: selectedAccount.name,
      members: this.isSelectMembersDisabled()
        ? selectedAccount.members.map(m => ({ pub_key: m }))
        : this.props.approvers.map(approver => ({ pub_key: approver })),
      security_scheme: {
        quorum: this.props.quorum
      }
    };
    if (selectedAccount.account_type === "ERC20") {
      data.erc20 = getERC20TokenByContractAddress(
        selectedAccount.contract_address
      );
    }
    try {
      await network(
        `/accounts/${this.props.selectedAccount.id}/security-scheme`,
        selectedAccount.status !== "VIEW_ONLY" ? "PUT" : "POST",
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

    return (
      <Fragment>
        <BlurDialog open={isOpen} onClose={onToggle}>
          <div className={classes.base}>
            {selectedAccount &&
              selectedAccount.status !== "VIEW_ONLY" && (
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
                            currency={account.currency_id}
                            index={account.index}
                          />
                        </span>
                      </MenuItem>
                    ))}
                  </ul>
                </div>
              )}
            <div className={classes.content}>
              <h3>{t("updateAccounts:provide")}</h3>
              <p>{t("updateAccounts:desc")}</p>
              {selectedAccount && (
                <div>
                  <Row label="Account">
                    <UpdateTextField
                      name="account_name"
                      placeholder="account name"
                      value={selectedAccount.name}
                      onChange={this.onChangeAccountName}
                      disabled={
                        selectedAccount.status === "VIEW_ONLY" &&
                        selectedAccount.account_type === "Ethereum"
                      }
                      error={!isValidAccountName(selectedAccount.name)}
                      errorMessage="only ASCII char, 19 max length"
                    />
                  </Row>
                  <Row label="Cryptocurrency / Index">
                    <CurrencyIndex
                      currency={selectedAccount.currency_id}
                      index={selectedAccount.index}
                    />
                  </Row>
                  <Row label="Balance">
                    <CurrencyAccountValue
                      account={selectedAccount}
                      value={selectedAccount.balance}
                      erc20Format={selectedAccount.account_type === "ERC20"}
                    />
                  </Row>
                  <Row label="Operation rules" noBorder>
                    <div>
                      {!this.isSelectMembersDisabled() && (
                        <RowSelectable
                          label="members"
                          descriptionSelected="selected"
                          onClick={onToggleMembers}
                          value={approvers.length}
                        />
                      )}
                    </div>
                    <div>
                      <Disabled
                        disabled={
                          approvers.length === 0 &&
                          !this.isSelectMembersDisabled()
                        }
                      >
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
                      disabled={this.isSubmitDisabled()}
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
          <ListApprovers
            approvers={approvers}
            addApprover={onToggleMember}
            goBack={onToggleMembers}
          />
        </BlurDialog>
        <BlurDialog open={isSelectingApprovals} onClose={onToggleApprovals}>
          <SetApprovals
            approvers={
              this.isSelectMembersDisabled()
                ? selectedAccount.members
                : approvers
            }
            quorum={quorum}
            setQuorum={onEditQuorum}
            goBack={onToggleApprovals}
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
  onEditName: name => dispatch(editName(name)),
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
  )(withStyles(styles)(translate()(UpdateAccounts)))
);
