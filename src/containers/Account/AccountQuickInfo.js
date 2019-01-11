//@flow
import Card from "components/Card";
import { Link } from "react-router-dom";
import DateFormat from "components/DateFormat";
import CurrencyIndex from "components/CurrencyIndex";
import {
  isAccountOutdated,
  isAccountBeingUpdated,
  hasUserApprovedAccount
} from "utils/accounts";
import Bell from "components/icons/thin/Bell";
import BlurDialog from "components/BlurDialog";
import MemberRow from "components/MemberRow";
import { translate, Trans } from "react-i18next";
import colors from "shared/colors";
import EditButton from "components/UpdateAccounts/EditButton";
import React, { Component, Fragment } from "react";
import { withStyles } from "@material-ui/core/styles";
import type { Account, Member, Translate } from "data/types";
import InfoBox from "components/InfoBox";

const row = {
  base: {
    lineHeight: "24px"
  },
  label: {
    fontSize: 12,
    textTransform: "uppercase",
    fontWeight: 600,
    color: "#424141"
  },
  value: {
    fontSize: 13,
    color: "#585858"
  }
};
const Row = withStyles(row)(
  ({
    label,
    value,
    classes
  }: {
    label: string,
    value: *,
    classes: { [_: $Keys<typeof row>]: string }
  }) => (
    <div className={classes.base}>
      <span className={classes.label}>{label}: </span>
      <span className={classes.value}>{value}</span>
    </div>
  )
);
const styles = {
  base: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between"
  },
  update: {
    cursor: "pointer",
    color: colors.grenade,
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold"
  },
  subtext: {
    color: "black",
    fontWeight: "normal"
  },
  right: {
    position: "absolute",
    top: 35,
    right: 50,

    background: "#ea2e492b",
    cursor: "pointer",
    padding: 20,
    borderRadius: 5,
    "& span": {
      width: 200,
      fontSize: 11,
      marginTop: 5,
      display: "block"
    }
  },
  modalMembers: {
    width: 400,
    padding: 20
  },
  modalMembersTitle: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
    margin: 0,
    padding: 4,
    paddingBottom: 20
  },
  toggleModalMembers: {
    display: "inline-block",
    marginLeft: 10,
    cursor: "pointer",
    textDecoration: "underline",
    color: colors.ocean
  },
  viewOnlyWarning: {
    marginTop: 20
  }
};
type Props = {
  account: Account,
  me: Member,
  match: Object,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string }
};

/* display only the currency and index if the account needs to be updated*/
const AccountTitle = ({ account }: { account: Account }) => (
  <div style={{ fontSize: 23 }}>
    {isAccountOutdated(account) ? (
      <CurrencyIndex index={account.index} currency={account.currency_id} />
    ) : (
      <div>{account.name}</div>
    )}
  </div>
);
type State = {
  modalMembersOpen: boolean
};
class AccountQuickInfo extends Component<Props, State> {
  state: State = {
    modalMembersOpen: false
  };

  toggleModalMembers = () => {
    const { modalMembersOpen } = this.state;
    this.setState({ modalMembersOpen: !modalMembersOpen });
  };

  renderMembersLink = () => {
    const {
      account,
      account: { members },
      classes: { toggleModalMembers }
    } = this.props;
    if (account.status === "VIEW_ONLY") {
      return <span>provide operations rule</span>;
    }
    return (
      <Fragment>
        <span>{members.length}</span>
        <span className={toggleModalMembers} onClick={this.toggleModalMembers}>
          <Trans i18nKey="accountView:members_modal.toggle" />
        </span>
      </Fragment>
    );
  };
  renderListMember = () => {
    const {
      classes: { modalMembers, modalMembersTitle },
      account: { members }
    } = this.props;
    return (
      <div className={modalMembers}>
        <div className={modalMembersTitle}>
          <Trans i18nKey="accountView:members_modal.title" />
        </div>
        <div>
          {members.map(m => (
            <MemberRow edidable={false} member={m} key={m.pub_key} />
          ))}
        </div>
      </div>
    );
  };

  render() {
    const { account, classes, me } = this.props;
    const { modalMembersOpen } = this.state;
    const orga = location.pathname.split("/")[1];
    return (
      <Fragment>
        <BlurDialog open={modalMembersOpen} onClose={this.toggleModalMembers}>
          {this.renderListMember()}
        </BlurDialog>
        <Card title={<AccountTitle account={account} />}>
          <div className={classes.base}>
            <div>
              <Row
                label={<Trans i18nKey="accountView:summary.index" />}
                value={
                  <CurrencyIndex
                    currency={account.currency_id}
                    index={account.index}
                  />
                }
              />
              <Row label="Unit" value={account.settings.currency_unit.code} />
              <Row
                label={<Trans i18nKey="accountView:summary.date" />}
                value={<DateFormat date={account.created_on} />}
              />
              {account.account_type === "ERC20" && account.parent_id && (
                <Fragment>
                  <Row
                    label={
                      <Trans i18nKey="accountView:summary.token_address" />
                    }
                    value={account.contract_address}
                  />
                  <Row
                    label={
                      <Trans i18nKey="accountView:summary.parent_account" />
                    }
                    value={<Link to={`${account.parent_id}`}>ETH account</Link>}
                  />
                </Fragment>
              )}
              {account.status === "VIEW_ONLY" && (
                <InfoBox
                  type="warning"
                  withIcon
                  className={classes.viewOnlyWarning}
                >
                  <Trans i18nKey="accountView:view_only_warning" />
                </InfoBox>
              )}
            </div>
            <div style={{ width: 300 }}>
              <Row
                label={<Trans i18nKey="accountView:summary.members" />}
                value={this.renderMembersLink()}
              />
              <Row
                label={<Trans i18nKey="accountView:summary.quorum" />}
                value={
                  account.status !== "VIEW_ONLY" &&
                  `${account.security_scheme.quorum} out of ${
                    account.members.length
                  }`
                }
              />
            </div>
            <div>
              {isAccountOutdated(account) && (
                <EditButton className={classes.update} account={account}>
                  <div className={classes.right}>
                    <span>
                      <Bell type="red" />
                      {<Trans i18nKey="update:provide_rule" />}
                    </span>
                    <span className={classes.subtext}>
                      {<Trans i18nKey="update:provide_rule_subtext" />}
                    </span>
                  </div>
                </EditButton>
              )}
              {isAccountBeingUpdated(account) &&
                !hasUserApprovedAccount(account, me) && (
                  <Link to={`/${orga}/pending`} className={classes.update}>
                    <div className={classes.right}>
                      <span>
                        <Bell type="red" />
                        <Trans i18nKey="updateAccounts:approve" />
                      </span>
                      <span className={classes.subtext}>
                        <Trans i18nKey="updateAccounts:desc_approve" />
                      </span>
                    </div>
                  </Link>
                )}
              {isAccountBeingUpdated(account) &&
                hasUserApprovedAccount(account, me) && (
                  <Link to={`/${orga}/pending`} className={classes.update}>
                    <div className={classes.right}>
                      <span>
                        <Bell type="red" />
                        <Trans i18nKey="updateAccounts:quorum" />
                      </span>
                      <span className={classes.subtext}>
                        <Trans i18nKey="updateAccounts:quorum_approve" />
                      </span>
                    </div>
                  </Link>
                )}
            </div>
          </div>
        </Card>
      </Fragment>
    );
  }
}

export default withStyles(styles)(translate()(AccountQuickInfo));
